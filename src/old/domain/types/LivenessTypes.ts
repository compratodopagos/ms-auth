import { ApiResponse } from "./Api";

export type LivenessResponse extends ApiResponse {
    sessionId: string;
}

export type LivenessResultResponse extends ApiResponse {
    isMatch: boolean;
}