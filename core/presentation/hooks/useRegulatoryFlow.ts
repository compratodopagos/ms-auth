import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RegisterStep } from "@core/domain/types";
import { setLoading, setRegulatory } from "../../../src/store/registerSlice";

import { UserController } from '../controllers'

import { UserAmplifyRepository } from "@core/infrastructure/repositories";
import {
  GetRegulatory,
  SetCountry,
  SetAddress,
  SetOcupation,
  SetStatement,
  SetTerms
} from "@core/application/useCases";

import store from '../../../src/store';
import { regulatorySteps } from "../../../src/schemas";
import { useNavigate } from "react-router-dom";
type RootState = ReturnType<typeof store.getState>;

const userRepo = new UserAmplifyRepository();

export function useRegulatoryFlow(refreshSteps = false) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    regulatory,
    loading
  } = useSelector((state: RootState) => state.register);

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));

      const command = new GetRegulatory(userRepo);
      const controller = new UserController(command);
      const { stepsStatus } = await controller.getRegulatory();
      const stepsCalc: RegisterStep[] = regulatorySteps;

      const updated = stepsCalc.map(step => ({
        ...step,
        completed: stepsStatus[step.id]
      }));

      dispatch(setRegulatory(updated));
      dispatch(setLoading(false));
    };

    if (!loading && regulatory.length === 0) init();
    console.log('effect refreshSteps y validSteps', refreshSteps)
  }, [refreshSteps]);

  const setCountry = async (country: string) => {
    const command = new SetCountry(userRepo);
    const { success, message } = await command.execute(country) || {};
    if (success) {
      navigate('/register/regulatory/residence');
    } else {
      return message;
    }
  }

  const setAddress = async (address: any) => {
    const command = new SetAddress(userRepo);
    const { success, message } = await command.execute(address);
    if (success) {
      navigate('/register/regulatory/ocupation');
    } else {
      return message;
    }
  }

  const setOcupation = async (ocupation: any) => {
    const command = new SetOcupation(userRepo);
    const { success, message } = await command.execute(ocupation);
    if (success) {
      navigate('/register/regulatory/statement');
    } else {
      return message;
    }
  }

  const setStatement = async (statement: any) => {
    const command = new SetStatement(userRepo);
    const { success, message } = await command.execute(statement);
    if (success) {
      navigate('/register/regulatory/tyc');
    } else {
      return message;
    }
  }

  const setTerms = async (tyc: boolean) => {
    const command = new SetTerms(userRepo);
    const { success, message } = await command.execute(tyc);
    if (success) {
      navigate('/register/completed');
    } else {
      return message;
    }
  }

  return {
    regulatory,
    setCountry,
    setAddress,
    setOcupation,
    setStatement,
    setTerms,
    loading,
    setLoading
  };
}