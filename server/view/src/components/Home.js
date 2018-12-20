import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    pre: {
        'white-space': 'pre-wrap',
    },
});

class Home extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
                <pre className={classes.pre}>
                    This is the demo web-client for the taiji-blockchain testnet. Please first create a wallet by clicking the Create Wallet menu and then go to <a href="https://faucet.taiji.io" rel="noreferrer noopener" target="_blank">taiji faucet</a> to populate up to 1000 TAIJI coins to start. You can populate up to 1000 taiji conins per day.
                </pre>
                <pre className={classes.pre}>
                    To learn more about the Taiji Blockchain, please visit <a href="https://doc.taiji.io/" rel="noreferrer noopener" target="_blank">doc.taiji.io</a>, <a href="https://github.com/networknt/taiji-blockchain" rel="noreferrer noopener" target="_blank">taiji-blockchain</a> and <a href="https://github.com/taiji-chain" rel="noreferrer noopener" target="_blank">taiji-chain organization</a>.
                </pre>
                <pre className={classes.pre}>
                    If you have questions or want to discuss the features, please visit <a href="https://gitter.im/networknt/taiji-blockchain" rel="noreferrer noopener" target="_blank">gitter room</a> or <a href="https://www.reddit.com/r/TaijiChain/" rel="noreferrer noopener" target="_blank">TaijiChain Reddit</a>.
                </pre>
                <pre className={classes.pre}>
                    If you find any UI problem, please open an issue at <a href="https://github.com/taiji-chain/web-client" rel="noreferrer noopener" target="_blank">web-client</a>
                </pre>
                <pre className={classes.pre}>
                    If you find any internal or logical problem, please open an issue at <a href="https://github.com/networknt/taiji-blockchain" rel="noreferrer noopener" target="_blank">taiji-blockchain</a>
                </pre>
                <pre className={classes.pre}>
                    Dec 20 - Update wallet format to include encryption key pair and add KYC - Know Your Client application. All existing wallet are removed.
                </pre>
            </div>
        )
    }
}

export default withStyles(styles)(Home);