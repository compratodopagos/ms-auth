import { ApiResponse } from "../types";

type UserResponse = {
  status?: string;
}

type AuthResponse = ApiResponse & UserResponse;

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
}