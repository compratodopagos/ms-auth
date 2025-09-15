import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { setSteps, setStepCompleted } from '../store/registerSlice';

// Constants
import { personalSteps, companySteps } from '../schemas';

// Entities
import { RootState } from '../../../entities/store';
import { AccountType } from '../../../entities/types';

export function useRegisterFlow() {

  const dispatch = useDispatch();
  const { steps } = useSelector((state: RootState) => state.register);
  const [typeAccount, setTypeAccount] = useState<string | null>(null);

  useEffect(() => {
    refreshSteps();
  }, []);

  const refreshSteps = () => {
    const storedType = localStorage.getItem("typeAccount") as AccountType | null;

    if (storedType) {
      setTypeAccount(storedType);
      dispatch(setSteps(storedType === "personal" ? personalSteps : companySteps));
    }
  }

  const setAccount = (type: AccountType) => {
    localStorage.setItem("typeAccount", type);
    refreshSteps();
  };

  const completeStep = (id: string) => {
    dispatch(setStepCompleted({ id, completed: true }));
  };

  return { typeAccount, steps, completeStep, setAccount };
}