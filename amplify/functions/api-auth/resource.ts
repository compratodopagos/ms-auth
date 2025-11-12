import { defineFunction } from "@aws-amplify/backend";

export const authApiFunction = defineFunction({
  name: "api-auth",
  environment: {
    stageName: process.env.stageName || "local",
    API_URL: process.env.API_CT || "https://k0wwgrt18j.execute-api.us-east-1.amazonaws.com",
  }
});