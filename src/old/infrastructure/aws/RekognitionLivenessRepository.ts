import { LivenessRepository } from "../../domain/repositories/LivenessRepository";
import { DocumentLivenessResponse, DocumentLivenessResultResponse } from "../../domain/Document";
import AWS from "aws-sdk";

const rekognition = new AWS.Rekognition();

export class RekognitionLivenessRepository implements LivenessRepository {
  
  async startSession(): Promise<DocumentLivenessResponse> {
    const response = await rekognition.createFaceLivenessSession({ /* parámetros */ }).promise();
    return {
      sessionId: response.SessionId!,
      status: "STARTED"
    };
  }

  async getResult(sessionId: string): Promise<DocumentLivenessResultResponse> {
    const response = await rekognition.getFaceLivenessSessionResults({ SessionId: sessionId }).promise();
    return {
      confidence: response.Confidence!,
      status: response.Status!
    };
  }
}
