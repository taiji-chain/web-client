#!/bin/bash
# local
cp currency/target/currency-1.0.0.jar /home/steve/light-chain/light-docker/local/web-client/service
cp kyc/target/kyc-1.0.0.jar /home/steve/light-chain/light-docker/local/web-client/service
cp token/target/token-1.0.0.jar /home/steve/light-chain/light-docker/local/web-client/service
cp wallet/target/wallet-1.0.0.jar /home/steve/light-chain/light-docker/local/web-client/service
# test
scp currency/target/currency-1.0.0.jar test3:/home/steve/light-chain/light-docker/test3/web-client/service
scp kyc/target/kyc-1.0.0.jar test3:/home/steve/light-chain/light-docker/test3/web-client/service
scp token/target/token-1.0.0.jar test3:/home/steve/light-chain/light-docker/test3/web-client/service
scp wallet/target/wallet-1.0.0.jar test3:/home/steve/light-chain/light-docker/test3/web-client/service


