import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Redux
import { setSteps, setStepCompleted } from '../store/registerSlice';

// Constants
import { personalSteps, companySteps } from '../schemas';

// Entities
import { RootState } from '../../../entities/store';
import { AccountType, RegisterStep } from '../../../entities/types';
import { postOption } from '../services/api.service';

export function useRegisterFlow(refreshSteps = false) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { steps } = useSelector((state: RootState) => state.register);

  useEffect(() => {
    if (refreshSteps) {
      const storedType = getTA() as AccountType | null;
      if (storedType) {
        const steps = storedType == 'personal' ? personalSteps : companySteps;
        validSteps(steps);
      } else {
        navigate('/register');
      }
    }
  }, []);

  const validSteps = async (steps: RegisterStep[]) => {
    const stepsId = steps.map(s => s.id);
    const { stepsStatus } = await postOption(`auth/steps`, { stepsId });
    dispatch(
      setSteps(steps.map(
        step => ({
          ...step,
          completed: stepsStatus[step.id]
        })
      ))
    )
    console.log(stepsStatus)
  }

  const setAccount = (type: AccountType) => {
    localStorage.setItem("tA", btoa(type));
    navigate('/register/terms');
  };

  const setEmail = async (email?: string) => {
    if (email) {
      localStorage.setItem('e', btoa(email));
    }
    const { success, message } = await postOption('auth/email', {});
    if (success) {
      navigate('/register/steps/email/valid');
    } else {
      return message;
    }
  }

  const setPassword = async (password: string, confirm_password:string) => {
    const { success, access_token, refresh_token, message } = await postOption('auth/password', { password, confirm_password });
    if (success) {
      document.cookie = `access_token=${access_token}; path=/; secure; samesite=Strict; max-age=7200`;
      document.cookie = `refresh_token=${refresh_token}; path=/; secure; samesite=Strict; max-age=${60 * 60 * 24 * 7}`;
      navigate('/register/steps');
    } else {
      return message;
    }
  }

  const validEmailCode = async (code: string) => {
    const { success, message } = await postOption('auth/email/valid', { code });
    if (success) {
      navigate('/register/steps');
    } else {
      let jsonMsg;
      try {
        const { message: msg } = JSON.parse(message);
        jsonMsg = msg;
      } catch (error) { }
      return jsonMsg || message;
    }
  }

  const completeStep = (id: string) => {
    dispatch(setStepCompleted({ id, completed: true }));
  };

  const getEmail = () => `${atob(localStorage.getItem('e') || "")}`
  const getTA = () => `${atob(localStorage.getItem('tA') || "")}`

  return {
    steps,
    completeStep,
    setAccount,
    setEmail,
    setPassword,
    validEmailCode,
    getEmail,
    getTA
  };
}