import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Redux
import { setSteps, setStepCompleted, setIsLogged, setTypeAccount, setLoading, setPhone, setDocs } from '../store/registerSlice';

// Constants
import { personalSteps, companySteps } from '../schemas';

// Entities
import { RootState } from '../../../entities/store';
import { AccountType, RegisterStep } from '../../../entities/types';
import { getOption, postOption } from '../services/api.service';
import { useRegisterTerms } from './useRegisterTerms';

export function useRegisterFlow(refreshSteps = false) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { steps, isLogged, loading, phone, accountType, docs } = useSelector((state: RootState) => state.register);
  const { validateTermsFreshness } = useRegisterTerms();

  const validSteps = useCallback(async (steps: RegisterStep[]) => {
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
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));
      const user: any = {
        type_account: getTA(),
        terms: validateTermsFreshness(),
        email: getEmail(),
      };

      try {
        const { user_data } = await getOption("auth/user");

        if (user_data) {
          user.type_account = user_data.type_account;
          user.email = user_data.email;
          user.terms = user_data.terms;
          if (!isLogged) {
            const docs = {};
            if(user_data.documents){
              user_data.documents.forEach(doc => {
                docs[doc.type] = doc.publicUrl;
              });
            }
            dispatch(setIsLogged());
            dispatch(setTypeAccount(user.type_account))
            dispatch(setDocs(docs))
          }
        }

      } catch (err) {
        console.error("Error en init:", err);
        // Manejo de errores opcional
      }

      if (refreshSteps && user.type_account) {
        const steps = user.type_account === "personal" ? personalSteps : companySteps;
        validSteps(steps);
      }

      if (!user.type_account) {
        navigate("/register");
        dispatch(setLoading(false));
        return;
      }

      // Validar términos al final
      if (!user.terms || user.terms === 0) {
        navigate("/register/terms");
        dispatch(setLoading(false));
        return;
      }
      dispatch(setLoading(false));
    };

    if (!loading)
      init();
  }, [validateTermsFreshness, navigate, refreshSteps, validSteps]);

  const setAccount = async (type: AccountType) => {
    if (!isLogged)
      localStorage.setItem("tA", btoa(type));
    else {
      await postOption('auth/user', { type_account: type });
      localStorage.removeItem('tA');
      dispatch(setTypeAccount(type));
    }
    navigate('/register/terms');
  };

  const setEmail = useCallback(async (email?: string) => {
    if (email) {
      localStorage.setItem('e', btoa(email));
    }
    const { success, message } = await postOption('auth/email', { type_account: getTA() });
    if (success) {
      navigate('/register/steps/email/valid');
    } else {
      return message;
    }
  }, [navigate, dispatch]);

  const setPhoneOpt = useCallback(async (phone?: string) => {
    const { success, message } = await postOption('auth/phone', { phone });
    if (success) {
      if(phone){
        dispatch(setPhone(phone));
      }
      navigate('/register/steps/phone/valid');
    } else {
      return message;
    }
  }, [navigate, dispatch]);

  const setPassword = async (password: string, confirm_password: string) => {
    const { success, message } = await postOption('auth/password', { password, confirm_password });
    if (success) {
      localStorage.clear();
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

  const validPhoneCode = async (code: string) => {
    const { success, message } = await postOption('auth/phone/valid', { code });
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
  const getTA = () => accountType || `${atob(localStorage.getItem('tA') || "")}`

  return {
    loading,
    phone,
    steps,
    docs,
    completeStep,
    setAccount,
    setEmail,
    setPassword,
    setPhoneOpt,
    validEmailCode,
    validPhoneCode,
    getEmail,
    getTA
  };
}