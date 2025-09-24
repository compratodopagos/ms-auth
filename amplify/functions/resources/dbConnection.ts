import mysql from 'mysql2/promise';
import { getSecretValue } from './getSecretValue';

const secret_ct = await getSecretValue('ct/dev/db_secret'); // El nombre de tu secreto
const secret = await getSecretValue('ctp/dev/db_secret'); // El nombre de tu secreto

export const poolCT = await mysql.createPool({
  host: secret_ct.host,
  user: secret_ct.username,
  password: secret_ct.password,
  database: 'auth_db'
});

export const pool = await mysql.createPool({
  host: secret.host,
  user: secret.username,
  password: secret.password,
  database: 'ctp_auth'
});