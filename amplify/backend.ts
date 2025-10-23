import { defineBackend } from '@aws-amplify/backend';
import { configApi } from './API/config';
import { authApiFunction } from './functions/api-auth/resource';
import { identityApiFunction } from './functions/api-identity/resource';
import { identityStorage } from './storage/resource';
import { auth } from './auth/resource';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  authApiFunction,
  identityApiFunction,
  identityStorage
});

const livenessStack = backend.createStack("liveness-stack");
const livenessPolicy = new Policy(livenessStack, "LivenessPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["rekognition:StartFaceLivenessSession"],
      resources: ["*"],
    }),
  ],
});
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(livenessPolicy); // allows guest user access
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(livenessPolicy); // allows logged in user access

configApi(backend);