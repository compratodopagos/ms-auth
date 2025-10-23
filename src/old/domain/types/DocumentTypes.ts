export type DocumentPayload {
    front?:string;
    back?: string;
    mimeType: "image/jpeg"
}

export type DocumentLivenessResponse {
    sessionId: string;
    status: string;
}

export type DocumentLivenessResultResponse {
    confidence: number;
    status: string;
}