
package io.taiji.client.currency.handler;

import com.networknt.monad.Result;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.SignedLedgerEntry;
import com.networknt.taiji.event.JsonMapper;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

@ServiceHandler(id="taiji.io/currency/transaction/1.0.0")
public class GetTransaction implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String address = map.get("address");
        String currency = map.get("currency");
        // otherwise, get it from the chain-reader service but don't put it into the cache as it is used for rate limiting.
        Result<List<SignedLedgerEntry>> result = TaijiClient.getTransaction(address, currency);
        if(result.isSuccess()) {
            List<SignedLedgerEntry> entries = result.getResult();
            return NioUtils.toByteBuffer(JsonMapper.toJson(entries));
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
        }
    }
}
