
package io.taiji.client.kyc.handler;

import com.networknt.chain.utility.Numeric;
import com.networknt.config.Config;
import com.networknt.monad.Result;
import com.networknt.status.Status;
import com.networknt.taiji.avro.AvroSerializer;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.*;
import com.networknt.taiji.event.EventId;
import com.networknt.taiji.event.JsonMapper;
import com.networknt.taiji.kyc.KycCreatedEvent;
import com.networknt.taiji.kyc.KycType;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

@ServiceHandler(id="taiji.io/kyc/create/1.0.0")
public class CreateKyc implements Handler {
    static final String WALLET_CANNOT_LOAD = "ERR12213";
    static final String FAIL_TO_CONNECT = "ERR122216";

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, Object> map = (Map<String, Object>)input;
        String currency = (String)map.get("currency");
        String address = (String)map.get("address");
        String password = (String)map.get("password");
        String type = (String)map.get("type");
        String id = (String)map.get("id");
        String email = (String)map.get("email");
        String name = (String)map.get("name");
        List<String> tags = (List<String>)map.get("tags");
        String description = (String)map.get("description");

        // validate the email is formatted correctly?
        // don't validate if the id and email is used already. Let the server to do it.
        Credentials credentials;
        try {
            credentials = loadWalletFromAddress(address, password);
        } catch (IOException | CipherException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            logger.error("Exception:", e);
            return NioUtils.toByteBuffer(getStatus(exchange, WALLET_CANNOT_LOAD, address));
        }

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

        KycCreatedEvent kycCreatedEvent = KycCreatedEvent.newBuilder()
                .setEventId(eventId)
                .setCurrency(currency)
                .setId(id)
                .setType(KycType.valueOf(type))
                .setEmail(email)
                .setKey(Numeric.toHexString(credentials.getEncryptingKeyPair().getPublic().getEncoded()))
                .setName(name)
                .setTags(tags)
                .setDescription(description)
                .build();

        AvroSerializer serializer = new AvroSerializer();
        byte[] bytes = serializer.serialize(kycCreatedEvent);

        // here we just create a credit entry only on with the toAddress the same and value 0
        LedgerEntry creditEntry = new LedgerEntry(address, 0, bytes);
        RawTransaction rtx = new RawTransaction(currency);
        rtx.addCreditEntry(address, creditEntry);
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

    Credentials loadWalletFromAddress(String address, String password) throws IOException, CipherException, NoSuchAlgorithmException, InvalidKeySpecException {
        InputStream is = Config.getInstance().getInputStreamFromFile(address + ".json");
        return WalletUtils.loadCredentials(password, is);
    }
}
