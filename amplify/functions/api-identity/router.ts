import { Pool } from 'mysql2/promise';
import { createLivenessSession } from "./actions/createLivenessSession";
import { getDocuments } from "./actions/getDocuments";
import { getLivenessResults } from "./actions/getLivenessResults";
import { storeFile } from "./actions/storeFile";
import { logout } from '../resources/logout';

export const routes: Record<string, (event: any, pool:Pool, user:any) => Promise<any>> = {
    "GET:/identity/rekognitionLiveness": getLivenessResults,
    "GET:/identity/documents": getDocuments,
    "POST:/identity/rekognitionLiveness": createLivenessSession,
    "POST:/identity/logout": async () => logout,
    "POST:/identity/storeFile": storeFile
};