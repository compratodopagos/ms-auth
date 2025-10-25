import { TermData } from "../types";
import { RegisterStep } from "../types/RegisterStep";

export interface RegisterState {
  phone?: string;
  loading: boolean;
  docs?: {
    front?: string;
    back?: string;
  },
  isLogged: boolean;
  accountType?:string;
  acceptDataUser?:TermData;
  acceptDataManagement?:TermData;
  acceptUserConditions?:TermData;
  steps: RegisterStep[];
}