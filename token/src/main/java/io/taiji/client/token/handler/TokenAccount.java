
package io.taiji.client.token.handler;

import com.networknt.config.JsonMapper;
import com.networknt.monad.Result;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.Keys;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

/**
 * Get token balance for an address and optionally a symbol
 *
 * @author Steve Hu
 */
@ServiceHandler(id="taiji.io/token/account/1.0.0")
public class TokenAccount implements Handler {
    static final String INVALID_WALLET_ADDRESS = "ERR12214";

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String address = map.get("address");
        String symbol = map.get("symbol");
        // address is mandatory and validate it.
        // validate if the fromAddress is formatted correctly.
        if (!Keys.validateToAddress(address)) {
            return NioUtils.toByteBuffer(getStatus(exchange, INVALID_WALLET_ADDRESS, address));
        }
        if(symbol != null && symbol.length() > 0) {
            Result<Map<String, Object>> tokenAccountResult = TaijiClient.getTokenAccountByAddressSymbol(address, symbol);
            if(tokenAccountResult.isSuccess()) {
                Map<String, Object> tokenAccount = tokenAccountResult.getResult();
                return NioUtils.toByteBuffer(JsonMapper.toJson(tokenAccount));
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenAccountResult.getError()));
            }

        } else {
            Result<Map<String, Object>> tokenAccountResult = TaijiClient.getTokenAccountByAddress(address);
            if(tokenAccountResult.isSuccess()) {
                Map<String, Object> tokenAccount = tokenAccountResult.getResult();
                return NioUtils.toByteBuffer(JsonMapper.toJson(tokenAccount));
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenAccountResult.getError()));
            }
        }
    }
}
