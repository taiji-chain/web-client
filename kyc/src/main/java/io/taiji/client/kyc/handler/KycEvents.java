
package io.taiji.client.kyc.handler;

import com.networknt.monad.Result;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.Keys;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import java.util.Map;

import com.networknt.utility.StringUtils;
import io.undertow.server.HttpServerExchange;

@ServiceHandler(id="taiji.io/kyc/events/1.0.0")
public class KycEvents implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String address = map.get("address");
        Result<String> result = TaijiClient.getKycEventsByAddress(address);
        if(result.isSuccess()) {
            return NioUtils.toByteBuffer(result.getResult());
        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
        }
    }
}
