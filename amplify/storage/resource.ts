import { defineStorage } from '@aws-amplify/backend';
import { identityApiFunction } from '../functions/api-identity/resource';
import { userApiFunction } from '../functions/api-user/resource';

export const identityStorage = defineStorage({
  name: 'identityDrive',
  isDefault: true,
  access: (allow) => ({
    'documents/*': [
      allow.resource(identityApiFunction).to(['read', 'write', 'delete']),
      allow.resource(userApiFunction).to(['read', 'write', 'delete']),
    ],
    'rekognition-liveness/*': [allow.resource(identityApiFunction).to(['read', 'write', 'delete'])],
  })
});