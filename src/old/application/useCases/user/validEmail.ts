import { UserRepository } from "../../domain/UserRepository";

export class validEmail {
    constructor(private userRepo: UserRepository){}

    async execute(code:string){
        return await this.userRepo.validEmail(code);
    }
}