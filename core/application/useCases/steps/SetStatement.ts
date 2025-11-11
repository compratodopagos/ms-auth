import { UserRepository } from "../../../domain/repositories";

export class SetStatement {
    constructor(private userRepo: UserRepository){}

    async execute(statement:any){
        return await this.userRepo.setStatement(statement);
    }
}