import { TermData } from "../types";
import { RegisterStep } from "../types/RegisterStep";

export interface RegisterState {
  accountType?:string;
  acceptDataUser?:TermData;
  acceptDataManagement?:TermData;
  acceptUserConditions?:TermData;
  steps: RegisterStep[];
}