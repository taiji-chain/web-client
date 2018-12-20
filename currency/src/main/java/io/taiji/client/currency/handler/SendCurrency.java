
package io.taiji.client.currency.handler;

import com.networknt.chain.utility.Console;
import com.networknt.config.Config;
import com.networknt.monad.Result;
import com.networknt.status.Status;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.*;
import com.networknt.taiji.event.JsonMapper;
import com.networknt.taiji.utility.Converter;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CyclicBarrier;

import io.undertow.server.HttpServerExchange;

import static com.networknt.chain.utility.Console.exitError;

@ServiceHandler(id="taiji.io/currency/send/1.0.0")
public class SendCurrency implements Handler {
    static final String WALLET_CANNOT_LOAD = "ERR12213";
    static final String INVALID_WALLET_ADDRESS = "ERR12214";
    static final String AMOUNT_NOT_NUMBER = "ERR12215";
    static final String FAIL_TO_CONNECT = "ERR122216";

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String currency = map.get("currency");
        String address = map.get("address");
        String password = map.get("password");
        String toAddress = map.get("toAddress");
        String amountString = map.get("amount"); // javascript doesn't support long so use string instead.
        String unitString = (String)map.get("unit");
        // make sure that the amount is number and can be converted to long value.
        Long amount = null;
        try {
            amount = Long.valueOf(amountString);
        } catch (NumberFormatException e) {
            return NioUtils.toByteBuffer(getStatus(exchange, AMOUNT_NOT_NUMBER, amountString));
        }
        Converter.Unit unit = Converter.Unit.fromString(unitString.toLowerCase());
        long amountInShell = Converter.toShell(amount, unit);

        // validate if the toAddress is formatted correctly.
        if (!Keys.validateToAddress(toAddress)) {
            return NioUtils.toByteBuffer(getStatus(exchange, INVALID_WALLET_ADDRESS, toAddress));
        }
        Credentials credentials;
        try {
            credentials = loadWalletFromAddress(address, password);
        } catch (Exception e) {
            logger.error("Exception:", e);
            return NioUtils.toByteBuffer(getStatus(exchange, WALLET_CANNOT_LOAD, address));
        }
        // calculate fee
        Result<Fee> feeResult = TaijiClient.getFee(address, currency);
        Fee fee = null;
        if(feeResult.isSuccess()) {
            fee = feeResult.getResult();
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, feeResult.getError()));
        }
        boolean innerChain = false;
        if(address.substring(0, 4).equals(toAddress.substring(0, 4))) {
            innerChain = true;
        }
        LedgerEntry feeEntry = new LedgerEntry(fee.getBankAddress(), innerChain? fee.getInnerChain() : fee.getInterChain());

        // here we just create a simple transaction with one debit entry and one credit entry.
        LedgerEntry ledgerEntry = new LedgerEntry(toAddress, amountInShell);
        RawTransaction rtx = new RawTransaction(currency);
        rtx.addCreditEntry(toAddress, ledgerEntry);
        rtx.addDebitEntry(credentials.getAddress(), ledgerEntry);
        rtx.addCreditEntry(fee.getBankAddress(), feeEntry);
        rtx.addDebitEntry(address, feeEntry);
        if(logger.isDebugEnabled()) logger.debug("Raw transaction before signed " + rtx);
        SignedTransaction stx = TransactionManager.signTransaction(rtx, credentials);
        if(logger.isDebugEnabled()) logger.debug("Calling TaijiClient with transaction " + stx);
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
