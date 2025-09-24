import { defineFunction } from "@aws-amplify/backend";

export const authApiFunction = defineFunction({
  name: "api-auth",
  environment: {
    API_URL: process.env.API_CT || "https://api.compratodo.com/api",
  }
});