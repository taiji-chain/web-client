const initialState = {
    toggleButton: false
};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_BUTTON_ACTION':
            return {
                ...state,
                toggleButton: !state.toggleButton
            };
        default:
            return state;
    }
}
