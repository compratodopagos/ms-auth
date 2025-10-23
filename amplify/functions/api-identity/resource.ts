import { defineFunction } from "@aws-amplify/backend";

export const identityApiFunction = defineFunction({
  name: "api-identity",
  memoryMB: 2048,
  timeoutSeconds: 10,
  layers: {
    "sharp": "sharp:1"
  }
});