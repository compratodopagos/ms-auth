import {
  StartLivenessSession,
  GetResultLivenessSession
} from "../../application/usecases";
import { DocumentLivenessResponse, DocumentLivenessResultResponse } from "../../domain/types";

type Command = StartLivenessSession | GetResultLivenessSession;

export class LivenessController {
  constructor(private commandLiveness: Command) { }

  async startLiveness() {
    try {
      return await (this.commandLiveness as StartLivenessSession).execute();
    } catch (error: any) {
      return ({} as DocumentLivenessResponse);
    }
  }

  async gettLivenessResultResponse(sessionId:string) {
    try {
      return await (this.commandLiveness as GetResultLivenessSession).execute(sessionId)
    } catch (error) {
      return ({} as DocumentLivenessResultResponse);
    }
  }

}