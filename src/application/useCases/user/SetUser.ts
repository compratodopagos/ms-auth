import { UserRepository } from "../../../domain/repositories";

export class SetPhone {
    constructor(private userRepo: UserRepository) { }

    async execute(phone?: string) {
        return await this.userRepo.setPhone(phone);
    }
}