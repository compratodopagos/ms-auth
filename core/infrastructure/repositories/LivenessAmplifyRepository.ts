import { LivenessRepository } from "../../domain/repositories";
import { apiService } from "../api/api.service";

export class LivenessAmplifyRepository implements LivenessRepository {

    async startSession(){
        return await apiService.post('identity/rekognitionLiveness', {});
    }

    async getResult(sessionId:string) {
        return await apiService.get(`identity/rekognitionLiveness/${sessionId}`);
    }

}
