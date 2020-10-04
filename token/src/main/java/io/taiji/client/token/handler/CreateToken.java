package io.taiji.client.token.handler;

import com.networknt.config.Config;
import com.networknt.config.JsonMapper;
import com.networknt.monad.Result;
import com.networknt.status.Status;
import com.networknt.taiji.avro.AvroSerializer;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.*;
import com.networknt.taiji.event.EventId;
import com.networknt.taiji.token.TokenCreatedEvent;
import com.networknt.taiji.utility.Converter;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

/**
 * This handler is calling the chain-writer service to create a ERC20 like token
 *
 * @author Steve Hu
 */
@ServiceHandler(id="taiji.io/token/create/1.0.0")
public class CreateToken implements Handler {
    static final String WALLET_CANNOT_LOAD = "ERR12213";
    static final String FAIL_TO_GENERATE_TOKEN_ADDRESS = "ERR12219";
    static final String TOTAL_SUPPLY_NOT_NUMBER = "ERR12217";
    static final String DECIMALS_NOT_NUMBER = "ERR12218";
    static final String FAIL_TO_CONNECT = "ERR122216";

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String currency = map.get("currency");
        String address = map.get("address");
        String password = map.get("password");
        String name = map.get("name");
        String description = map.get("description");
        String symbol = map.get("symbol");
        String totalSupplyString = map.get("totalSupply");
        String decimalsString = map.get("decimals");
        // validate the total supply
        Long totalSupply = null;
        try {
            totalSupply = Long.valueOf(totalSupplyString);
        } catch (NumberFormatException e) {
            return NioUtils.toByteBuffer(getStatus(exchange, TOTAL_SUPPLY_NOT_NUMBER, totalSupplyString));
        }
        // validate decimals
        Integer decimals = null;
        try {
            decimals = Integer.valueOf(decimalsString);
        } catch (NumberFormatException e) {
            return NioUtils.toByteBuffer(getStatus(exchange, DECIMALS_NOT_NUMBER, decimalsString));
        }
        // calculate total
        long factor = Converter.power(10, decimals);
        long total = totalSupply * factor;

        Credentials credentials;
        try {
            credentials = loadWalletFromAddress(address, password);
        } catch (Exception e) {
            logger.error("Exception:", e);
            return NioUtils.toByteBuffer(getStatus(exchange, WALLET_CANNOT_LOAD, address));
        }
        String tokenAddress = null;
        try {
            AddressGenerator generator = new AddressGenerator(address.substring(0, 4));
            tokenAddress = Keys.getAddress(generator.generate());
        } catch(Exception e) {
            logger.error("Exception:",e);
            return NioUtils.toByteBuffer(getStatus(exchange, FAIL_TO_GENERATE_TOKEN_ADDRESS, e.getMessage()));
        }

        // get number of transactions from the chain-reader to generate eventId.
        long nonce = 0;
        Result<String> nonceResult = TaijiClient.getTransaction(address, currency, 0, 1);
        if(nonceResult.isSuccess()) {
            List<Map<String, Object>> txs = JsonMapper.string2List(nonceResult.getResult());
            nonce = (Long)txs.get(0).get("no") + 1;
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, nonceResult.getError()));
        }

        EventId eventId = EventId.newBuilder()
                .setAddress(address)
                .setNonce(nonce)
                .build();
        Map<String, Object> valueMap = new HashMap<>();
        valueMap.put("name", name);
        valueMap.put("description", description);

        TokenCreatedEvent tokenCreatedEvent = TokenCreatedEvent.newBuilder()
                .setEventId(eventId)
                .setCurrency(currency)
                .setEntityAddress(tokenAddress)
                .setValue(JsonMapper.toJson(valueMap))
                .setSymbol(symbol)
                .setTotalSupply(total)
                .setDecimals(decimals)
                .build();

        AvroSerializer serializer = new AvroSerializer();
        byte[] bytes = serializer.serialize(tokenCreatedEvent);

        // here we just create a credit entry only on with the toAddress the token address and value 0
        LedgerEntry creditEntry = new LedgerEntry(tokenAddress, 0, bytes);
        RawTransaction rtx = new RawTransaction(currency);
        rtx.addCreditEntry(tokenAddress, creditEntry);
        // calculate the fee for the debit entry
        Result<Fee> feeResult = TaijiClient.getFee(address, currency);
        Fee fee = null;
        if(feeResult.isSuccess()) {
            fee = feeResult.getResult();
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, feeResult.getError()));
        }
        LedgerEntry feeEntry = new LedgerEntry(fee.getBankAddress(), fee.getApplication());
        rtx.addCreditEntry(fee.getBankAddress(), feeEntry);
        rtx.addDebitEntry(address, feeEntry);
        SignedTransaction stx = TransactionManager.signTransaction(rtx, credentials);

        Status status = TaijiClient.postTx(credentials.getAddress().substring(0, 4), stx);
        if(status != null && status.getStatusCode() == 200) {
            Map<String, Object>  result = new HashMap<>();
            result.put("status", "sent");
            result.put("tokenAddress", tokenAddress);
            result.put("transaction", rtx);
            return NioUtils.toByteBuffer(JsonMapper.toJson(result));
        } else {
            if(status == null) {
                return NioUtils.toByteBuffer(getStatus(exchange, FAIL_TO_CONNECT));
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, status));
            }
        }
    }

    Credentials loadWalletFromAddress(String address, String password) throws Exception {
        InputStream is = Config.getInstance().getInputStreamFromFile(address + ".json");
        return WalletUtils.loadCredentials(password, is);
    }

}
