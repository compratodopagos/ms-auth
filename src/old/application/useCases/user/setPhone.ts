import { UserRepository } from "../../domain/UserRepository";

export class setPhone {
    constructor(private userRepo: UserRepository) { }

    async execute(phone?: string) {
        return await this.userRepo.setPhone(phone);
    }
}