
package io.taiji.client.wallet.handler;

import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import io.undertow.server.HttpServerExchange;

@ServiceHandler(id="taiji.io/wallet/close/1.0.0")
public class CloseWallet implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        return NioUtils.toByteBuffer("CloseWallet");
    }
}
