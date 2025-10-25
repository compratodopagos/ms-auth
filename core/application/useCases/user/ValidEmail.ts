import { UserRepository } from "../../../domain/repositories";

export class ValidEmail {
    constructor(private userRepo: UserRepository){}

    async execute(code:string){
        return await this.userRepo.validEmail(code);
    }
}