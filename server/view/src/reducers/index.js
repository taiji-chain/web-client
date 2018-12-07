import { combineReducers } from 'redux';
import WalletReducer from './WalletReducer';
import CurrencyReducer from "./CurrencyReducer";
import FormReducer from "./FormReducer";

export default combineReducers({
    wallet: WalletReducer,
    currency: CurrencyReducer,
    form: FormReducer
});