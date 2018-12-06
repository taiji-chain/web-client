import React, {Component, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { getBalance, handleAddressChange} from '../actions';
import {connect} from 'react-redux';

class Balance extends Component {

    render() {
        console.log(this.props.currency.address);
        let result;
        if(this.props.currency.balance) {
            result = <div>The balance of TAIJI is {this.props.currency.balance} in SHELL</div>
        } else {
            if(this.props.currency.error) {
                console.log('error is not empty');
                result = <div>Error: {this.props.currency.error}</div>
            } else {
                result = ''
            }
        }
        return (
            <Fragment>
                <form>
                    <TextField
                        label="Address"
                        value={this.props.currency.address}
                        onChange={this.props.handleChange}
                        margin="normal"
                        style={{width: 370}}
                    />
                </form>
                <Button color="primary" variant="contained" onClick={() => this.props.getBalance(this.props.currency.address)}>
                    Balance
                </Button>
                {result}
             </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    currency: state.currency
});

const mapDispatchToProps = dispatch => ({
    getBalance: address => dispatch(getBalance(address)),
    handleChange: event => dispatch(handleAddressChange(event))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Balance);
