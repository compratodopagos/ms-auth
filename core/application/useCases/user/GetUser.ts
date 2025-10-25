import { UserRepository } from "../../../domain/repositories";

export class GetUser {
    constructor(private userRepo: UserRepository){}

    async execute(){
        return await this.userRepo.getUser();
    }
}