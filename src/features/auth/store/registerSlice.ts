import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegisterState } from '../../../entities/store';
import { RegisterStep, Terms } from '../../../entities/types';

const initialState: RegisterState = {
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
    })
  },
});

export const { setSteps, setTerms, setStepCompleted } = registerSlice.actions;
export default registerSlice.reducer;