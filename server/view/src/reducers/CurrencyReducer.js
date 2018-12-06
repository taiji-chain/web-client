const initialState = {
    address: ''
};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'ADDRESS_FIELD_CHANGED':
            return {
                ...state,
                address: action.payload
            };
        case 'GET_BALANCE_SUCCESS':
            return {
                ...state,
                balance: action.payload
            };
        case 'GET_BALANCE_FAILURE':
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
}
