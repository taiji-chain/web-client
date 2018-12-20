
package io.taiji.client.token.handler;

import com.networknt.config.Config;
import com.networknt.monad.Result;
import com.networknt.status.Status;
import com.networknt.taiji.avro.AvroSerializer;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.*;
import com.networknt.taiji.event.EventId;
import com.networknt.taiji.event.JsonMapper;
import com.networknt.taiji.token.TokenTransferredEvent;
import com.networknt.taiji.token.TokenWithdrewEvent;
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
 * If you are holding some tokens, this endpoint helps you to send tokens to another address.
 *
 * @author Steve Hu
 */
@ServiceHandler(id="taiji.io/token/transfer/1.0.0")
public class TransferToken implements Handler {
    static final String INVALID_WALLET_ADDRESS = "ERR12214";
    static final String AMOUNT_NOT_NUMBER = "ERR12215";
    static final String WALLET_CANNOT_LOAD = "ERR12213";
    static final String FAIL_TO_CONNECT = "ERR122216";

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String address = map.get("address");
        String password = map.get("password");
        String tokenAddressOrSymbol = map.get("tokenAddressOrSymbol");
        String toAddress = map.get("toAddress");
        String amountString = map.get("amount");

        Long amount = null;
        try {
            amount = Long.valueOf(amountString);
        } catch (NumberFormatException e) {
            return NioUtils.toByteBuffer(getStatus(exchange, AMOUNT_NOT_NUMBER, amountString));
        }

        Credentials credentials;
        try {
            credentials = loadWalletFromAddress(address, password);
        } catch (Exception e) {
            logger.error("Exception:", e);
            return NioUtils.toByteBuffer(getStatus(exchange, WALLET_CANNOT_LOAD, address));
        }

        // differentiate between tokenAddress and Symbol. And validate if the tokenAddress is formatted correctly.
        String tokenAddress;
        String currency;
        String symbol;
        Map<String, Object> tokenInfo = null;

        if (!Keys.validateToAddress(tokenAddressOrSymbol)) {
            // check if it is a symbol by getting the token info by symbol.
            Result<Map<String, Object>> tokenInfoResult = TaijiClient.getTokenInfoBySymbol(tokenAddressOrSymbol);
            if(tokenInfoResult.isSuccess()) {
                tokenInfo = tokenInfoResult.getResult();
                tokenAddress = (String)tokenInfo.get("entityAddress");
                currency = (String)tokenInfo.get("currency");
                symbol = (String)tokenInfo.get("symbol");
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenInfoResult.getError()));
            }
        } else {
            tokenAddress = tokenAddressOrSymbol;
            Result<Map<String, Object>> tokenInfoResult = TaijiClient.getTokenInfoByAddress(tokenAddress);
            if(tokenInfoResult.isSuccess()) {
                tokenInfo = tokenInfoResult.getResult();
                currency = (String)tokenInfo.get("currency");
                symbol = (String)tokenInfo.get("symbol");
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenInfoResult.getError()));
            }
        }
        // validate if the toAddress is formatted correctly.
        if (!Keys.validateToAddress(toAddress)) {
            return NioUtils.toByteBuffer(getStatus(exchange, INVALID_WALLET_ADDRESS, toAddress));
        }

        int decimals = (Integer)tokenInfo.get("decimals");
        long factor = Converter.power(10, decimals);
        long total = amount * factor;

        // get number of transactions from the chain-reader to generate eventId.
        long nonce = 0;
        Result<List<SignedLedgerEntry>> nonceResult = TaijiClient.getTransaction(address, currency);
        if(nonceResult.isSuccess()) {
            nonce = nonceResult.getResult().size();
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, nonceResult.getError()));
        }

        EventId eventId = EventId.newBuilder()
                .setAddress(address)
                .setNonce(nonce)
                .build();

        TokenTransferredEvent tokenTransferredEvent = new TokenTransferredEvent(eventId, symbol, toAddress, total);

        AvroSerializer serializer = new AvroSerializer();
        byte[] bytes = serializer.serialize(tokenTransferredEvent);

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
            Map<String, Object> result = new HashMap<>();
            result.put("status", "sent");
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
