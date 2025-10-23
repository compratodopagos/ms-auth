import { configureStore } from "@reduxjs/toolkit";
import registerReducer from '../features/auth/store/registerSlice';

export default configureStore({
    reducer: {
        register: registerReducer
    }
});