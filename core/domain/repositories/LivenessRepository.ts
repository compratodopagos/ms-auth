import { DocumentLivenessResponse, DocumentLivenessResultResponse } from "../types";

export interface LivenessRepository {
    startSession(): Promise<DocumentLivenessResponse>;
    getResult(sessionId:string): Promise<DocumentLivenessResultResponse>;
}