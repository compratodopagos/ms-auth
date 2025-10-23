import { LivenessRepository } from "../../domain/repositories/LivenessRepository";

export class StartLivenessSession {
    constructor(private readonly livenessRepo: LivenessRepository) { }

    async execute() {
        return await this.livenessRepo.startSession();
    }
}