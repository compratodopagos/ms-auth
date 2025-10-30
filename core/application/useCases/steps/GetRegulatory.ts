import { UserRepository } from "../../../domain/repositories";

export class GetRegulatory {
    constructor(private userRepo: UserRepository){}

    async execute(){
        return await this.userRepo.getRegulatory();
    }
}