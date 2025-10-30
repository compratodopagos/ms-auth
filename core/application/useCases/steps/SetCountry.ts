import { UserRepository } from "../../../domain/repositories";

export class SetCountry {
    constructor(private userRepo: UserRepository){}

    async execute(country:string){
        return await this.userRepo.setCountry(country);
    }
}