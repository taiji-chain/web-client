import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory'
import Home from './components/Home';
import Balance from './components/Balance';
import Faucet from './components/Faucet';
import Transaction from './components/Transaction';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import Form from './components/Form';

export const history = createBrowserHistory();

class App extends Component {

    state = {
        address: '',
        amount: '',
        currency: 'taiji',
        unit: 'TAIJI',
        currencyMap: undefined,
        transactions: undefined
    };

    handleChange = name => event => {
        //console.log(name, event.target.value);
        this.setState({
            [name]: event.target.value,
        });
    };

    getBalance = async (e) => {
        e.preventDefault();
        //console.log('address', this.state.address);
        const api_call = await fetch(`/faucet/${this.state.address}`);
        const data = await api_call.json();
        //console.log(data);
        if (data) {
            this.setState({
                currencyMap: data
            });
        } else {
            this.setState({
                currencyMap: undefined
            });
        }
    };

    postFaucet = async (e) => {
        e.preventDefault();
        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: this.state.amount,
                currency: this.state.currency,
                unit: this.state.unit
            })
        };

        const api_call = await fetch(`/faucet/${this.state.address}`, settings)
        const data = await api_call.json();
        if (data) {
            this.setState({
                currencyMap: data
            });
        } else {
            this.setState({
                currencyMap: undefined
            });
        }
    };

    getTransaction = async (e) => {
        e.preventDefault();
        const api_call = await fetch(`/faucet/${this.state.address}/${this.state.currency}`);
        const data = await api_call.json();
        //console.log(data);
        if (data) {
            this.setState({
                transactions: data
            });
        } else {
            this.setState({
                transactions: undefined
            });
        }
    };


    render() {
        return (
            <Router history={history}>
                <ResponsiveDrawer>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/form/:formId" component={Form} />
                        <Route path="/balance" component={Balance} />
                        <Route path="/faucet" render = {
                            props => <Faucet {...props}
                                              postFaucet={this.postFaucet}
                                              handleChange={this.handleChange}
                                              address={this.state.address}
                                              amount={this.state.amount}
                                              currency={this.state.currency}
                                              unit={this.state.unit}
                                              currencyMap={this.state.currencyMap}/>} />
                        <Route path="/transaction" render = {
                            props => <Transaction {...props}
                                             getTransaction={this.getTransaction}
                                             handleChange={this.handleChange}
                                             address={this.state.address}
                                             currency={this.state.currency}
                                             transactions={this.state.transactions}/>} />
                    </Switch>
                </ResponsiveDrawer>
            </Router>
        );
    }
}

export default App;
