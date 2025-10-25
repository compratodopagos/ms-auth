import { UserRepository } from "../../../domain/repositories";

export class ValidPhone {
    constructor(private userRepo: UserRepository){}

    async execute(code:string){
        return await this.userRepo.validPhone(code);
    }
}