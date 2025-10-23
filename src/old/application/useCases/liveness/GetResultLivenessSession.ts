import { LivenessRepository } from "../../domain/repositories/LivenessRepository";

export class GetResultLivenessSession {
    constructor(private readonly livenessRepo: LivenessRepository) { }

    async execute(sessionId: string) {
        return await this.livenessRepo.getResult(sessionId);
    }
}