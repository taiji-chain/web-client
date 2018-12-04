
package io.taiji.client.wallet.handler;

import com.networknt.taiji.crypto.Credentials;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import io.undertow.server.HttpServerExchange;

@ServiceHandler(id="taiji.io/wallet/open/1.0.0")
public class OpenWallet implements Handler {
    public static Credentials credentials = null;
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {

        return NioUtils.toByteBuffer("OpenWallet");
    }
}
