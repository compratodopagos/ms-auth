import { TermData } from "@core/domain/types";
import { RegisterStep } from "@core/domain/types";

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
  regulatory: RegisterStep[];
}