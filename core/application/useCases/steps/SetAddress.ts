import { UserRepository } from "../../../domain/repositories";

export class SetAddress {
    constructor(private userRepo: UserRepository){}

    async execute(address:any){
        return await this.userRepo.setAddress(address);
    }
}