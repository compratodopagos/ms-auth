import { UserRepository } from "../../../domain/repositories";

export class SetPassword {
    constructor(private userRepo: UserRepository){}

    async execute(password:string, confirm_password:string){
        if(password !== confirm_password){
            return { success: false, message: 'Las contraseñas no coinciden' };
        }
        return await this.userRepo.setPassword(password, confirm_password);
    }
}