import { UserRepository } from "../../../domain/repositories";

export class setEmail {
    constructor(private userRepo: UserRepository) { }

    async execute(email: string) {
        return await this.userRepo.setEmail(email);
    }
}