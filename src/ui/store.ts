import { configureStore } from "@reduxjs/toolkit";
import registerReducer from './store/registerSlice';

export default configureStore({
    reducer: {
        register: registerReducer
    }
});