import { Login } from "../../application/usecases";

export class AuthController {
  constructor(private loginUser: Login) { }

  async handleLogin(email: string, password: string) {
    try {
      return await this.loginUser.execute(email, password);
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}