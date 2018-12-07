
package io.taiji.client.currency.handler;

import com.networknt.monad.Result;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.event.JsonMapper;
import com.networknt.utility.NioUtils;
import io.undertow.server.HttpServerExchange;

import java.nio.ByteBuffer;
import java.util.Map;

@ServiceHandler(id="taiji.io/currency/balance/1.0.0")
public class GetBalance implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String address = map.get("address");
        // otherwise, get it from the chain-reader service but don't put it into the cache as it is used for rate limiting.
        Result<Map<String, Long>> result = TaijiClient.getSnapshot(address);
        if(result.isSuccess()) {
            Map<String, Long> currencyMap = result.getResult();
            return NioUtils.toByteBuffer(JsonMapper.toJson(currencyMap));
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
        }
    }
}
