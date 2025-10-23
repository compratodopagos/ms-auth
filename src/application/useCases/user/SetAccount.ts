import { UserRepository } from "../../../domain/repositories";
import { AccountType } from "../../../domain/types";

export class SetAccount {
    constructor(private userRepo: UserRepository) { }

    async execute(type: AccountType) {
        return await this.userRepo.setAccount(type);
    }
}