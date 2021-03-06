
package io.taiji.client.token.handler;

import com.networknt.config.JsonMapper;
import com.networknt.monad.Result;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.Keys;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

/**
 * Get token info by tokenAddress or Symbol
 *
 * @author Steve Hu
 */
@ServiceHandler(id="taiji.io/token/info/1.0.0")
public class TokenInfo implements Handler {
    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String tokenAddressOrSymbol = map.get("tokenAddressOrSymbol");
        if(tokenAddressOrSymbol != null) {
            if (!Keys.validateToAddress(tokenAddressOrSymbol)) {
                // check if it is a symbol by getting the token info by symbol.
                Result<Map<String, Object>> tokenInfoResult = TaijiClient.getTokenInfoBySymbol(tokenAddressOrSymbol);
                if(tokenInfoResult.isSuccess()) {
                    Map<String, Object> tokenInfo = tokenInfoResult.getResult();
                    return NioUtils.toByteBuffer(JsonMapper.toJson(tokenInfo));
                } else {
                    return NioUtils.toByteBuffer(getStatus(exchange, tokenInfoResult.getError()));
                }
            } else {
                // valid address and this must be tokenAddress
                Result<Map<String, Object>> tokenInfoResult = TaijiClient.getTokenInfoByAddress(tokenAddressOrSymbol);
                if(tokenInfoResult.isSuccess()) {
                    Map<String, Object> tokenInfo = tokenInfoResult.getResult();
                    return NioUtils.toByteBuffer(JsonMapper.toJson(tokenInfo));
                } else {
                    return NioUtils.toByteBuffer(getStatus(exchange, tokenInfoResult.getError()));
                }
            }
        } else {
            // there is no tokenAddressOrSymbol, get all tokens
            Result<List<Map<String, Object>>> tokenInfosResult = TaijiClient.getTokenInfos(0, 10);
            if(tokenInfosResult.isSuccess()) {
                List<Map<String, Object>> tokenInfos = tokenInfosResult.getResult();
                return NioUtils.toByteBuffer(JsonMapper.toJson(tokenInfos));
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenInfosResult.getError()));
            }
        }
    }
}
