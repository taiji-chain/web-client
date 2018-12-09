
package io.taiji.client.token.handler;

import com.networknt.monad.Result;
import com.networknt.taiji.client.TaijiClient;
import com.networknt.taiji.crypto.WalletUtils;
import com.networknt.taiji.event.JsonMapper;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

import io.undertow.server.HttpServerExchange;

/**
 * Get token transactions for an address and optionally a symbol.
 *
 * @author Steve Hu
 */
@ServiceHandler(id="taiji.io/token/transaction/1.0.0")
public class TokenTransaction implements Handler {
    static final String INVALID_WALLET_ADDRESS = "ERR12214";

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String address = map.get("address");
        String symbol = map.get("symbol");
        // address is mandatory and validate it.
        // validate if the fromAddress is formatted correctly.
        if (!WalletUtils.isValidAddress(address)) {
            return NioUtils.toByteBuffer(getStatus(exchange, INVALID_WALLET_ADDRESS, address));
        }
        if(symbol != null && symbol.length() > 0) {
            Result<List<Map<String, Object>>> tokenTransactionResult = TaijiClient.getTokenTransactionByAddressSymbol(address, symbol);
            if(tokenTransactionResult.isSuccess()) {
                List<Map<String, Object>> tokenTransaction = tokenTransactionResult.getResult();
                return NioUtils.toByteBuffer(JsonMapper.toJson(tokenTransaction));
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenTransactionResult.getError()));
            }

        } else {
            Result<List<Map<String, Object>>> tokenTransactionResult = TaijiClient.getTokenTransactionByAddress(address);
            if(tokenTransactionResult.isSuccess()) {
                List<Map<String, Object>> tokenTransaction = tokenTransactionResult.getResult();
                return NioUtils.toByteBuffer(JsonMapper.toJson(tokenTransaction));
            } else {
                return NioUtils.toByteBuffer(getStatus(exchange, tokenTransactionResult.getError()));
            }
        }
    }
}
