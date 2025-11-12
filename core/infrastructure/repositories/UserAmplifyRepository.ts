import { UserRepository } from "../../domain/repositories/UserRepository";
import { AccountType, ApiResponse, DocumentPayload } from "../../domain/types";
import { apiService } from "../api/api.service";

export class UserAmplifyRepository implements UserRepository {

    async getUser(){
        const { user } = await apiService.get('auth/users');
        return user;
    }

    async setAccount(type: AccountType) {
        const { user } = await apiService.post('auth/email', { type_account: type });
        return user;
    }

    async setEmail(email: string, type_account?:string) {
        return await apiService.post('auth/email', { email, type_account });
    }

    async validEmail(code:string) {
        return await apiService.post('auth/email/valid', { code });
    }

    async getSteps() {
        const { type_account, stepsStatus, docs } = await apiService.get('auth/steps');
        return { type_account, stepsStatus, docs };
    }

    async getRegulatory() {
        return await apiService.get('auth/regulatory');
    }

    async setPassword(password:string, confirm_password:string) {
        return await apiService.post('auth/password', { password, confirm_password });
    }

    async setPhone(phone?:string) {
        return await apiService.post('auth/phone', { phone });
    }

    async validPhone(code:string) {
        return await apiService.post('auth/phone/valid', { code });
    }

    async setDocument(payload: DocumentPayload) {
        return await await apiService.post("identity/storeFile", payload);
    }

    async setCountry(country:string) {
        return await apiService.post('auth/country', { country });
    }

    async setAddress(payload: any): Promise<ApiResponse> {
        return await apiService.post('/auth/address', payload);
    }

    async setOcupation(ocupation:string) {
        return await apiService.post('auth/ocupation', { ocupation });
    }

    async setStatement(payload:any) {
        return await apiService.post('auth/statement', payload);
    }

    async setTerms(tyc:boolean) {
        return await apiService.post('auth/terms', { tyc });
    }

    async setNit(nit:string) {
        return await apiService.post('auth/nit', { nit });
    }

}
