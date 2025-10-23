import { ApiResponse } from "./ApiTypes";

export type LivenessResponse = ApiResponse & {
  sessionId: string;
};

export type LivenessResultResponse = ApiResponse & {
  isMatch: boolean;
};