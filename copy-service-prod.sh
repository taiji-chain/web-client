#!/bin/bash
# prod
scp currency/target/currency-1.0.0.jar taiji3:/home/steve/light-chain/light-config-prod/taiji3/web-client/service
scp kyc/target/kyc-1.0.0.jar taiji3:/home/steve/light-chain/light-config-prod/taiji3/web-client/service
scp token/target/token-1.0.0.jar taiji3:/home/steve/light-chain/light-config-prod/taiji3/web-client/service
scp wallet/target/wallet-1.0.0.jar taiji3:/home/steve/light-chain/light-config-prod/taiji3/web-client/service


