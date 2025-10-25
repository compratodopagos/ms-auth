import { UserRepository } from "../../../domain/repositories";

export class GetSteps {
    constructor(private userRepo: UserRepository){}

    async execute(){
        return await this.userRepo.getSteps();
    }
}