import { ApiResponse } from "./ApiTypes";

export type DocumentPayload = {
    front?:string;
    back?: string;
    mimeType: "image/jpeg"
}

type DocumentResponse = {
    s3Url?:string;
}

export type DocumentApiResponse = ApiResponse & DocumentResponse;

type LivenessResponse = {
    sessionId: string;
    status: string;
}

export type DocumentLivenessResponse = ApiResponse & LivenessResponse;

type LivenessResultResponse = {
    confidence: number;
    isMatch: boolean;
    status: string;
}

export type DocumentLivenessResultResponse = ApiResponse & LivenessResultResponse;