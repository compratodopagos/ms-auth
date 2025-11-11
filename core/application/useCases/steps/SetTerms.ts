import { UserRepository } from "../../../domain/repositories";

export class SetTerms {
    constructor(private userRepo: UserRepository){}

    async execute(tyc:boolean){
        return await this.userRepo.setTerms(tyc);
    }
}