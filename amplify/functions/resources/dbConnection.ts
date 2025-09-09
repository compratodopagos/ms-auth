import mysql from 'mysql2/promise';
import { getSecretValue } from './getSecretValue';

const secret = await getSecretValue('ctp/dev/db_secret'); // El nombre de tu secreto

export const pool = await mysql.createPool({
  host: secret.host,
  user: secret.username,
  password: secret.password,
  database: 'ctp_auth'
});

export const poolAdmin = await mysql.createPool({
  host: secret.host,
  user: secret.username,
  password: secret.password,
  database: 'ctp_admin'
});