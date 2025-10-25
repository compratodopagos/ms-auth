import { UserRepository } from "../../../domain/repositories";

export class SetEmail {
    constructor(private userRepo: UserRepository) { }

    async execute(email: string, type_account?:string) {
        return await this.userRepo.setEmail(email, type_account);
    }
}