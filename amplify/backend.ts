import { defineBackend } from '@aws-amplify/backend';
import { data } from '../amplify/data/resource';
import { termsApiFunction } from './functions/api-terms/resource';
import { userApiFunction } from './functions/api-user/resource';
import { identityApiFunction } from './functions/api-identity/resource';
import { configApi } from './API/config';
import { identityStorage } from './storage/resource';
import { loginApiFunction } from './functions/api-login/resource';

const backend = defineBackend({
  data,
  termsApiFunction,
  userApiFunction,
  identityApiFunction,
  identityStorage,
  loginApiFunction,
});

configApi(backend);