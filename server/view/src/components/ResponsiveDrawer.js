import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
});


class ResponsiveDrawer extends Component {
    state = {
        mobileOpen: false,
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    render() {
        const { classes, children, location: { pathname }, theme } = this.props;
        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <MenuList>
                    <MenuItem component={Link} to="/" selected={'/' === pathname}>
                        Home
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/form/walletCreateForm" selected={'/form/walletCreateForm' === pathname}>
                        Create Wallet
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/form/currencySendForm" selected={'/form/currencySendForm' === pathname}>
                        Send Currency
                    </MenuItem>
                    <MenuItem component={Link} to="/form/currencyBalanceForm" selected={'/form/currencyBalanceForm' === pathname}>
                        Currency Balance
                    </MenuItem>
                    <MenuItem component={Link} to="/form/currencyTransactionForm" selected={'/form/currencyTransactionForm' === pathname}>
                        Currency Transaction
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/form/tokenCreateForm" selected={'/form/tokenCreateForm' === pathname}>
                        Create Token
                    </MenuItem>
                    <MenuItem component={Link} to="/form/tokenWithdrawForm" selected={'/form/tokenWithdrawForm' === pathname}>
                        Withdraw Token
                    </MenuItem>
                    <MenuItem component={Link} to="/form/tokenTransferForm" selected={'/form/tokenTransferForm' === pathname}>
                        Transfer Token
                    </MenuItem>
                    <MenuItem component={Link} to="/form/tokenApproveForm" selected={'/form/tokenApproveForm' === pathname}>
                        Approve Token
                    </MenuItem>
                    <MenuItem component={Link} to="/form/tokenInfoForm" selected={'/form/tokenInfoForm' === pathname}>
                        Token Info
                    </MenuItem>
                    <MenuItem component={Link} to="/form/tokenAccountForm" selected={'/form/tokenAccountForm' === pathname}>
                        Token Account
                    </MenuItem>
                    <MenuItem component={Link} to="/form/tokenTransactionForm" selected={'/form/tokenTransactionForm' === pathname}>
                        Token Transaction
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/form/kycCreateForm" selected={'/form/kycCreateForm' === pathname}>
                        Create KYC
                    </MenuItem>
                    <MenuItem component={Link} to="/form/kycInfoForm" selected={'/form/kycInfoForm' === pathname}>
                        KYC Info
                    </MenuItem>
                    <MenuItem component={Link} to="/form/kycEventForm" selected={'/form/kycEventForm' === pathname}>
                        KYC Event
                    </MenuItem>
                </MenuList>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            Taiji Blockchain - Testnet
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    {/* The implementation can be swap with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
        );
    }
}


ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default compose (
    withRouter,
    withStyles(styles, { withTheme: true })
)(ResponsiveDrawer);
