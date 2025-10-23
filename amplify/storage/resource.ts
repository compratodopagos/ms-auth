import { defineStorage } from '@aws-amplify/backend';
import { identityApiFunction } from '../functions/api-identity/resource';
import { authApiFunction } from '../functions/api-auth/resource';

export const identityStorage = defineStorage({
  name: 'identityDrive',
  isDefault: true,
  access: (allow) => ({
    'documents/*': [
      allow.resource(identityApiFunction).to(['read', 'write', 'delete']),
      allow.resource(authApiFunction).to(['read']),
    ],
    'rekognition-liveness/*': [allow.resource(identityApiFunction).to(['read', 'write', 'delete'])],
  })
});