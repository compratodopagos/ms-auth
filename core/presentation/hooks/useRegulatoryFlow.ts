import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RegisterStep } from "@core/domain/types";
import { setLoading, setRegulatory } from "../../../src/store/registerSlice";

import { UserController } from '../controllers'

import { UserAmplifyRepository } from "@core/infrastructure/repositories";
import {
  GetRegulatory,
  SetCountry
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

  const validSteps = useCallback(async () => {
    const command = new GetRegulatory(userRepo);
    const controller = new UserController(command);
    const { stepsStatus } = await controller.getRegulatory();
    const stepsCalc: RegisterStep[] = regulatorySteps;

    const updated = stepsCalc.map(step => ({
      ...step,
      completed: stepsStatus[step.id]
    }));
    console.log(updated)

    dispatch(setRegulatory(updated));

    return updated;
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));

      let updatedSteps = regulatory;
      if (regulatory.length == 0 || refreshSteps){
        updatedSteps = await validSteps();
      }

      dispatch(setLoading(false));
    };

    if (!loading) init();
  }, [refreshSteps, validSteps]);

  const setCountry = async (country: string) => {
    const command = new SetCountry(userRepo);
    const controller = new UserController(command);
    const { success, message } = await controller.setEmail(country) || {};
    if (success) {
      navigate('/register/regulatory/residence');
    } else {
      return message;
    }
  }

  return {
    regulatory,
    setCountry,
    loading,
    setLoading
  };

}