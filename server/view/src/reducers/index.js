import { combineReducers } from 'redux';
import WalletReducer from './WalletReducer';
import CurrencyReducer from "./CurrencyReducer";

export default combineReducers({
    wallet: WalletReducer,
    currency: CurrencyReducer
});