import { DocumentPayload } from "../../domain/Document";
import { UserRepository } from "../../domain/UserRepository";

export class SetDocument {
    constructor(private userRepo: UserRepository){}

    async execute(payload: DocumentPayload){
        return await this.userRepo.setDocument(payload);
    }
}