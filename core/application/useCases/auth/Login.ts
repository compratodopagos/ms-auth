import { AuthRepository } from "../../../domain/repositories";

export class Login {
    constructor(private authRepo: AuthRepository){}

    async execute(email: string, password: string){
        return await this.authRepo.login(email, password);
    }
}