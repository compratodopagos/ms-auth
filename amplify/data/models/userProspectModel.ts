import { a } from "@aws-amplify/backend";

export const userProspectModel = {
    userProspectModel: a.model({
        email: a.string(),
        phoneNombre: a.string(),
        phoneNombreAt: a.datetime()
    }).authorization((allow) => [allow.publicApiKey()])
}