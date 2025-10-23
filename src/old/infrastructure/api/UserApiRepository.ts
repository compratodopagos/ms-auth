import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { apiService } from "./api.service";

export class UserApiRepository implements UserRepository {

    async getUser(): Promise<User> {
        const { user } = await apiService.post("/user");
        return new User(
            user.id,
            user.email,
            user.email_verified_at,
            user.phone,
            user.phone_verified_at,
            user.hasPassword,
            user.documentNumber,
            user.status
        );
    }

    async setEmail(email: string): Promise<User> {
        const { user } = await apiService.post("/users/email", { email });
        return new User(
            user.id,
            user.email,
            user.email_verified_at,
            user.phone,
            user.phone_verified_at,
            user.hasPassword,
            user.documentNumber,
            user.status
        );
    }

    // async validateEmail(code: string): Promise<User> {
    //     const { user } = await apiService.post("/users/email/validate", { code });
    //     return new User(
    //         user.id,
    //         user.email,
    //         user.email_verified_at,
    //         user.phone,
    //         user.phone_verified_at,
    //         user.hasPassword,
    //         user.documentNumber,
    //         user.status
    //     );
    // }

    // async setDocument(document: string): Promise<User> {
    //     const { user } = await apiService.post("/users/document", { document });
    //     return new User(
    //         user.id,
    //         user.email,
    //         user.email_verified_at,
    //         user.phone,
    //         user.phone_verified_at,
    //         user.hasPassword,
    //         user.documentNumber,
    //         user.status
    //     );
    // }

    // async validateDocument(sessionId: string): Promise<User> {
    //     const data = await apiService.get(`/users/document/validate/${sessionId}`);
    //     return new User(data.email, undefined, data.document, undefined, data.isDocumentVerified);
    // }
}
