import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Redux
import { setSteps, setStepCompleted } from '../store/registerSlice';

// Constants
import { personalSteps, companySteps } from '../schemas';

// Entities
import { RootState } from '../../../entities/store';
import { AccountType } from '../../../entities/types';

export function useRegisterFlow() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { steps } = useSelector((state: RootState) => state.register);

  useEffect(() => {
    const storedType = localStorage.getItem("typeAccount") as AccountType | null;

    if (storedType) {
      dispatch(setSteps(storedType === "personal" ? personalSteps : companySteps));
    }
  }, []);

  const setAccount = (type: AccountType) => {
    localStorage.setItem("typeAccount", type);
    navigate('/register/terms');
  };

  const completeStep = (id: string) => {
    dispatch(setStepCompleted({ id, completed: true }));
  };

  return { steps, completeStep, setAccount };
}