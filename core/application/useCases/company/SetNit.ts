import { UserRepository } from "../../../domain/repositories";

export class SetNit {
    constructor(private userRepo: UserRepository) { }

    async execute(nit: string) {
        return await this.userRepo.setNit(nit);
    }
}