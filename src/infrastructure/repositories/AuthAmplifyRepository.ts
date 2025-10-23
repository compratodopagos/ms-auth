import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { apiService } from "../api/api.service";

export class AuthAmplifyRepository implements AuthRepository {

    async login(email: string, password: string) {
        return await apiService.post("/auth/login", { email, password });
    }
}