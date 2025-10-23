import { useCallback, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useRegisterTerms } from "../../ui/hooks";

import { AccountType, DocumentPayload, RegisterStep } from "../../domain/types";
import { setLoading, setSteps, setTypeAccount, setDocs } from "../../ui/store/registerSlice";

import { UserController, LivenessController } from '../controllers'

import { LivenessAmplifyRepository, UserAmplifyRepository } from "../../infrastructure/repositories";
import {
  GetSteps,
  SetEmail, ValidEmail,
  SetPassword,
  SetPhone, ValidPhone,
  SetDocument,
  StartLivenessSession,
  GetResultLivenessSession
} from "../../application/usecases";

import store from '../../ui/store';
import { companySteps, personalSteps } from "../../ui/schemas";
type RootState = ReturnType<typeof store.getState>;

const userRepo = new UserAmplifyRepository();

export function useRegisterFlow(refreshSteps = false) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    docs,
    steps,
    isLogged,
    loading,
    accountType,
  } = useSelector((state: RootState) => state.register);

  const { validateTermsFreshness } = useRegisterTerms();

  const validSteps = useCallback(async () => {
    const command = new GetSteps(userRepo);
    const controller = new UserController(command);
    const { stepsStatus, type_account, docs: docsDB } = await controller.getSteps();
    const stepsCalc: RegisterStep[] =
      (type_account || getTA()) === "personal" ? personalSteps : companySteps;

    if(docsDB){
      dispatch(setDocs(docsDB))
    }

    const updated = stepsCalc.map(step => ({
      ...step,
      completed: (
        step.id == 'identity' && docsDB?.front && docsDB?.back && docsDB?.verified
      )? true : stepsStatus[step.id]
    }));

    dispatch(setSteps(updated));

    return updated;
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));

      const user: any = {
        type_account: getTA(),
        terms: validateTermsFreshness(),
        email: getEmail(),
      };

      if (!isLogged) {

      }

      let updatedSteps = steps;
      if (steps.length == 0 || refreshSteps) {
        updatedSteps = await validSteps();
      }

      const hasEmail = updatedSteps.find(s => s.id == 'email').completed;
      if (!hasEmail && !user.terms || user.terms === 0) {
        const pathname: string = location.pathname;
        if (pathname !== '/register' && pathname !== '/register/terms') {
          navigate("/register/terms");
        }
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(false));
    };

    if (!loading)
      init();
  }, [validateTermsFreshness, refreshSteps, validSteps]);

  const getEmail = () => `${atob(localStorage.getItem('e') || "")}`
  const getTA = () => accountType || `${atob(localStorage.getItem('tA') || "")}`;

  const setAccount = async (type: AccountType) => {
    if (!isLogged)
      localStorage.setItem("tA", btoa(type));
    else {
      const setUserCommand = new SetEmail(userRepo);
      const setAccountController = new UserController(setUserCommand);
      await setAccountController.setAccount(type);
      localStorage.removeItem('tA');
      dispatch(setTypeAccount(type));
    }
    navigate('/register/terms');
  };

  const setEmail = async (email: string) => {
    const command = new SetEmail(userRepo);
    const controller = new UserController(command);
    const { success, message } = await controller.setEmail(email) || {};
    if (success) {
      if (email) {
        localStorage.setItem('e', btoa(email));
      }
      navigate('/register/steps/email/valid');
    } else {
      return message;
    }
  }

  const validEmailCode = async (code: string) => {
    const command = new ValidEmail(userRepo);
    const controller = new UserController(command);
    const { success, message } = await controller.validEmailCode(code);
    if (success) {
      navigate('/register/steps');
    } else {
      return message;
    }
  };

  const setPassword = async (password: string, confirm_password: string) => {
    const command = new SetPassword(userRepo);
    const controller = new UserController(command);
    const { success, message } = await controller.setPassword(password, confirm_password);
    if (success) {
      navigate('/register/steps');
    } else {
      return message;
    }
  }

  const setPhone = async (phone: string) => {
    const command = new SetPhone(userRepo);
    const controller = new UserController(command);
    const { success, message } = await controller.setPhone(phone);
    if (success) {
      navigate('/register/steps/phone/valid');
    } else {
      return message;
    }
  }

  const validPhoneCode = async (code: string) => {
    const command = new ValidPhone(userRepo);
    const controller = new UserController(command);
    const { success, message } = await controller.validPhoneCode(code);
    if (success) {
      navigate('/register/steps');
    } else {
      return message;
    }
  };

  const setDocument = async (payload: DocumentPayload) => {
    const command = new SetDocument(userRepo);
    const controller = new UserController(command);
    const { success, message, s3Url } = await controller.setDocument(payload);
    if (success) {
      return { s3Url };
    } else {
      return { message };
    }
  }

  const startLivenessSession = async () => {
    const livenessRepo = new LivenessAmplifyRepository();
    const command = new StartLivenessSession(livenessRepo);
    const controller = new LivenessController(command);
    return await controller.startLiveness();
  }

  const getResultLivenessSession = async (sessionId:string) => {
    const livenessRepo = new LivenessAmplifyRepository();
    const command = new GetResultLivenessSession(livenessRepo);
    const controller = new LivenessController(command);
    return await controller.gettLivenessResultResponse(sessionId);
  }

  return {
    docs,
    steps,
    getEmail,
    setEmail,
    setPhone,
    setAccount,
    setPassword,
    setDocument,
    validEmailCode,
    validPhoneCode,
    startLivenessSession,
    getResultLivenessSession,
  };

}