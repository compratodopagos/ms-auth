import {
  GetSteps,
  GetRegulatory,
  SetAccount,
  SetEmail, ValidEmail,
  SetPassword,
  SetPhone, ValidPhone,
  SetDocument,
  SetCountry,
  SetAddress,
  SetNit
} from "../../application/useCases";
import { AccountType, DocumentPayload, StatusStepsType } from "../../domain/types";

type Command = GetSteps | SetCountry | SetNit | GetRegulatory | SetAccount | SetEmail | ValidEmail | SetPassword | SetPhone | ValidPhone | SetDocument | SetAddress;

export class UserController {
  constructor(private commandUser: Command) { }

  async getSteps() {
    try {
      return await (this.commandUser as GetSteps).execute();
    } catch (error: any) {
      return ({} as StatusStepsType);
    }
  }

  async getRegulatory() {
    try {
      return await (this.commandUser as GetRegulatory).execute();
    } catch (error) {
      return ({} as StatusStepsType);
    }
  }

  async setAccount(type: AccountType) {
    try {
      return await (this.commandUser as SetAccount).execute(type);
    } catch (error) {
      return false;
    }
  }

  async setEmail(email: string, type_account?: string) {
    try {
      return await (this.commandUser as SetEmail).execute(email, type_account);
    } catch (error) {
      return false;
    }
  }

  async validEmailCode(code: string) {
    try {
      return await (this.commandUser as ValidEmail).execute(code);
    } catch (error) {
      return { success: false, message: error.message || `${error}` }
    }
  }

  async setPassword(password: string, confirm_password: string) {
    try {
      return await (this.commandUser as SetPassword).execute(password, confirm_password);
    } catch (error) {
      return { success: false, message: error.message || `${error}` }
    }
  }

  async setPhone(phone?: string) {
    try {
      return await (this.commandUser as SetPhone).execute(phone);
    } catch (error) {
      return { success: false, message: error.message || `${error}` }
    }
  }

  async validPhoneCode(code: string) {
    try {
      return await (this.commandUser as ValidPhone).execute(code);
    } catch (error) {
      return { success: false, message: error.message || `${error}` }
    }
  }

  async setDocument(payload: DocumentPayload) {
    try {
      return await (this.commandUser as SetDocument).execute(payload);
    } catch (error) {
      return { success: false, message: error.message || `${error}` }
    }
  }

  async setNit(nit: string) {
    try {
      return await (this.commandUser as SetNit).execute(nit);
    } catch (error) {
      return { success: false, message: error.message || `${error}` }
    }
  }

}