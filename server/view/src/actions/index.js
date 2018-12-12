import {history} from '../App';
export const GET_BALANCE = 'GET_BALANCE';
export const GET_BALANCE_SUCCESS = 'GET_BALANCE_SUCCESS';
export const GET_BALANCE_FAILURE = 'GET_BALANCE_FAILURE';
export const ADDRESS_FIELD_CHANGED = 'ADDRESS_FIELD_CHANGED';

export const POST_FAUCET = 'POST_FAUCET';
export const POST_FAUCET_SUCCESS = 'POST_FAUCET_SUCCESS';
export const POST_FAUCET_FAILURE = 'POST_FAUCET_FAILURE';

export const TOGGLE_BUTTON_ACTION = 'TOGGLE_BUTTON_ACTION';

export const SUBMIT_FORM_STARTED = 'SUBMIT_FORM_STARTED';
export const SUBMIT_FORM_SUCCESS = 'SUBMIT_FORM_SUCCESS';
export const SUBMIT_FORM_FAILURE = 'SUBMIT_FORM_FAILURE';

export function getBalance(address) {
    console.log(address);
    return async (dispatch) => {
        try {
            if(address == null || address.length === 0) {
                console.log('dispatch error address is empty');
                dispatch({type: GET_BALANCE_FAILURE, payload: 'Address is empty'})
            } else {
                const response = await fetch(`/faucet/${address}`);
                const data = await response.json();
                console.log("data", data);
                dispatch({ type: 'GET_BALANCE_SUCCESS', payload: data.taiji })
            }
        }
        catch(e) {
            dispatch({ type: 'GET_BALANCE_FAILURE', payload: e.toString() })
        }
    }
}

export function postFaucet(address, currency, amount, unit) {
    return async (dispatch) => {
        const request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                unit: unit
            })
        };

        try {
            const response = await fetch(`/faucet/${address}.json`, request);
            const data = await response.json();
            console.log("data", data);
            dispatch({ type: 'POST_FAUCET_SUCCESS', payload: data })
        }
        catch(e) {
            console.log("error " + e.toString());
            dispatch({ type: 'POST_FAUCET_FAILURE', error: e.toString()})
        }
    }
}

export const toggleButtonAction = () => {
    return {
        type: 'TOGGLE_BUTTON_ACTION'
    }
};

export const handleAddressChange = event => {
    return {
         type: 'ADDRESS_FIELD_CHANGED',
         payload: event.target.value
     };
};

export function submitForm(action) {
    return async (dispatch) => {
        dispatch({type: SUBMIT_FORM_STARTED});
        const request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action)
        };
        console.log(request);
        try {
            const response = await fetch('/api/webclient', request);
            const data = await response.json();
            console.log("data", data);
            dispatch({ type: SUBMIT_FORM_SUCCESS, payload: data });
            history.push(action.success);
        } catch(e) {
            console.log("error " + e.toString());
            dispatch({ type: SUBMIT_FORM_FAILURE, error: e.toString()})
        }
    }
}
