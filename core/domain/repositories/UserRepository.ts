import { User } from "../entities/User";
import { AccountType, ApiResponse, DocumentApiResponse, DocumentPayload, StatusStepsType } from "../types";

export interface UserRepository {
  getUser(): Promise<User>;
  getSteps(): Promise<StatusStepsType>;
  getRegulatory(): Promise<StatusStepsType>;
  setEmail(email: string, type_account?:string): Promise<ApiResponse>;
  setAccount(type: AccountType): Promise<User>;
  validEmail(code: string): Promise<ApiResponse>;
  setPassword(password: string, confirm_password: string): Promise<ApiResponse>;
  setPhone(phone?: string): Promise<ApiResponse>;
  validPhone(code: string): Promise<ApiResponse>;
  setDocument(payload: DocumentPayload): Promise<DocumentApiResponse>;
  setCountry(country:string): Promise<ApiResponse>;
  setAddress(address:any): Promise<ApiResponse>;
  setOcupation(ocupation:string): Promise<ApiResponse>;
  setStatement(statement:any): Promise<ApiResponse>;
  setTerms(tyc:boolean): Promise<ApiResponse>;
}