import { DocumentPayload } from "../../../domain/types";
import { UserRepository } from "../../../domain/repositories";

export class SetDocument {
    constructor(private userRepo: UserRepository){}

    async execute(payload: DocumentPayload){
        return await this.userRepo.setDocument(payload);
    }
}