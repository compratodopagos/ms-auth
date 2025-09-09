import { defineFunction } from "@aws-amplify/backend";

export const loginApiFunction = defineFunction({
  name: "api-login",
  environment: {
    RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET || "",
  }
});