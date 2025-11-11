import { UserRepository } from "../../../domain/repositories";

export class SetOcupation {
    constructor(private userRepo: UserRepository){}

    async execute(country:string){
        return await this.userRepo.setOcupation(country);
    }
}