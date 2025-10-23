import { UserRepository } from "../../domain/UserRepository";

export class validPhone {
    constructor(private userRepo: UserRepository){}

    async execute(code:string){
        return await this.userRepo.validPhone(code);
    }
}