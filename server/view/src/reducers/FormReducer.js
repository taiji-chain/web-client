const initialState = {};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'SUBMIT_FORM_SUCCESS':
            return {
                ...state,
                result: action.payload
            };
        case 'SUBMIT_FORM_FAILURE':
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
}
