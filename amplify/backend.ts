import { defineBackend } from '@aws-amplify/backend';
import { authApiFunction } from './functions/api-auth/resource';
import { configApi } from './API/config';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  authApiFunction
});

configApi(backend);