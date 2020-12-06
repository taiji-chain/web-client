
package io.taiji.client.wallet.handler;

import com.networknt.taiji.crypto.CipherException;
import com.networknt.taiji.crypto.WalletUtils;
import com.networknt.config.JsonMapper;
import com.networknt.utility.NioUtils;
import com.networknt.rpc.Handler;
import com.networknt.rpc.router.ServiceHandler;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.util.HashMap;
import java.util.Map;

import io.undertow.server.HttpServerExchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.networknt.config.Config.LIGHT_4J_CONFIG_DIR;

@ServiceHandler(id="taiji.io/wallet/create/1.0.0")
public class CreateWallet implements Handler {
    static final Logger logger = LoggerFactory.getLogger(CreateWallet.class);
    private static final String PASSWORD_CONFIRM_NOT_MATCH = "ERR12211";
    private static final String CREATE_WALLET_ERROR = "ERR12212";

    public static String getDefaultKeyDirectory() {
        return System.getProperty(LIGHT_4J_CONFIG_DIR);
    }

    @Override
    public ByteBuffer handle(HttpServerExchange exchange, Object input)  {
        Map<String, String> map = (Map<String, String>)input;
        String password = map.get("password");
        String passwordConfirm = map.get("passwordConfirm");
        if(password.equals(passwordConfirm)) {
            String chainId = map.get("region");
            File destination = null;
            String destDir = getDefaultKeyDirectory();
            if(destDir == null) {
                ClassLoader classLoader = getClass().getClassLoader();
                destination = new File(classLoader.getResource("config").getFile());
            } else {
                destination = new File(destDir);
            }
            if(logger.isDebugEnabled()) logger.debug("chainId = " + chainId + " destDir = " + destination.getAbsolutePath());
            try {
                String walletFileName = WalletUtils.generateFullNewWalletFile(password, destination, chainId);
                if(logger.isDebugEnabled()) logger.debug("Wallet file " + walletFileName
                        + " successfully created in: " + destDir);

                Map<String, String> result = new HashMap<>();
                result.put("address", walletFileName.substring(0, walletFileName.indexOf(".")));
                result.put("filename", walletFileName);
                result.put("directory", destination.getAbsolutePath());
                return NioUtils.toByteBuffer(JsonMapper.toJson(result));
            } catch (CipherException | IOException | InvalidAlgorithmParameterException
                    | NoSuchAlgorithmException | NoSuchProviderException e) {
                logger.error("Exception:", e);
                return NioUtils.toByteBuffer(getStatus(exchange, CREATE_WALLET_ERROR, e.getMessage()));
            }

        } else {
            return NioUtils.toByteBuffer(getStatus(exchange, PASSWORD_CONFIRM_NOT_MATCH));
        }
    }
}
