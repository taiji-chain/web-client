
package io.taiji.client.currency.handler;

import com.networknt.monad.Result;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

@ServiceHandler(id="taiji.io/currency/transaction/1.0.0")
public class GetTransaction implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, Object> map = (Map<String, Object>)input;
        String address = (String)map.get("address");
        String currency = (String)map.get("currency");
        int pageNumber = (Integer)map.get("pageNumber");
        int pageSize = (Integer)map.get("pageSize");
        // otherwise, get it from the chain-reader service but don't put it into the cache as it is used for rate limiting.
        Result<String> result = TaijiClient.getTransaction(address, currency, (pageNumber -1) * pageSize , pageSize);
        if(result.isSuccess()) {
            return NioUtils.toByteBuffer(result.getResult());
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
        }
    }
}
