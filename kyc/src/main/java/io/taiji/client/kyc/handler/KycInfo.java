
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

@ServiceHandler(id="taiji.io/kyc/info/1.0.0")
public class KycInfo implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String addressOrIdOrEmail = map.get("addressOrIdOrEmail");
        if (!Keys.validateToAddress(addressOrIdOrEmail)) {
            // check if it is an email or an id
            if(StringUtils.isEmail(addressOrIdOrEmail)) {
                // email
                Result<String> result = TaijiClient.getKycByEmail(addressOrIdOrEmail);
                if(result.isSuccess()) {
                    return NioUtils.toByteBuffer(result.getResult());
                } else {
                    return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
                }
            } else {
                // id
                Result<String> result = TaijiClient.getKycById(addressOrIdOrEmail);
                if(result.isSuccess()) {
                    return NioUtils.toByteBuffer(result.getResult());
                } else {
                    return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
                }
            }
        } else {
            // valid address
            Result<String> result = TaijiClient.getKycByAddress(addressOrIdOrEmail);
            if(result.isSuccess()) {
                return NioUtils.toByteBuffer(result.getResult());
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, result.getError()));
            }
        }
    }
}
