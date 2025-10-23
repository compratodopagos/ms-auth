import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegisterState } from '../../../entities/store';
import { RegisterStep, Terms } from '../../../entities/types';

const initialState: RegisterState = {
  loading: false,
  isLogged: false,
  steps: [],
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setStepCompleted: (state, { payload }: PayloadAction<{ id: string; completed: boolean }>) => ({
      ...state,
      steps: state.steps.map(s => {
        const { id, completed } = payload;
        if(s.id === id) s.completed = completed;
        return s;
      })
    }),
    setSteps: (state, { payload: steps }: PayloadAction<RegisterStep[]>) => ({
      ...state,
      steps
    }),
    setTerms: (state, { payload: terms }: PayloadAction<Terms>) => ({
      ...state,
      acceptDataUser: terms.acceptDataUser,
      acceptDataManagement: terms.acceptDataManagement,
      acceptUserConditions: terms.acceptUserConditions,
    }),
    setDocs: (state, { payload: docs }: PayloadAction<{ front?:string, back?:string }>) => ({ ...state, docs }),
    setLoading: (state, { payload: loading }: PayloadAction<boolean>) => ({ ...state, loading }),
    setIsLogged: (state) => ({ ...state, isLogged: true }),
    setTypeAccount: (state, { payload: type }: PayloadAction<string>) => ({ ...state, accountType: type }),
    setPhone: (state, { payload: phone }: PayloadAction<string>) => ({ ...state, phone }),
  },
});

export const {
  setSteps,
  setPhone,
  setTerms,
  setDocs,
  setLoading,
  setIsLogged,
  setTypeAccount,
  setStepCompleted,
} = registerSlice.actions;
export default registerSlice.reducer;