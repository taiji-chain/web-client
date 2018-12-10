import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

class CurrencyBalance extends Component {

    render() {
        console.log(this.props.form.result);
        let result;
        if(this.props.form.result) {
            result = <div>The balance of TAIJI is {this.props.form.result['taiji']} in SHELL</div>
        } else {
            if(this.props.error) {
                console.log('error is not empty');
                result = <div>Error: {this.props.form.error}</div>
            } else {
                result = ''
            }
        }
        return (
            <Fragment>
                {result}
             </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    form: state.form
});


export default connect(
    mapStateToProps
)(CurrencyBalance);
