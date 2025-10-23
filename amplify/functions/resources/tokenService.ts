import crypto from "crypto";
import { Pool } from "mysql2/promise";

// Crear tokens (access + refresh)
export const generateToken = async (
  poolCT: Pool,
  userId: string,
  sourceIp: string,
  userAgent: string | null
) => {

  await destroyTokens(poolCT, userId);

  // Access Token (corto plazo, 1 hora)
  const plainAccess = crypto.randomBytes(40).toString("hex"); // 80 chars
  const hashedAccess = crypto.createHash("sha256").update(plainAccess).digest("hex");

  const [result]: any = await poolCT.query(
    `
      INSERT INTO personal_access_tokens
        (tokenable_type, tokenable_id, name, token, abilities, expires_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), NOW(), NOW())
    `,
    [
      "App\\Models\\User",
      userId,
      "auth_token",
      hashedAccess,
      JSON.stringify(["*"]),
    ]
  );

  const access_token_id = result.insertId;
  const access_token = `${access_token_id}|${plainAccess}`;

  // Refresh Token (plazo más largo, ej. 3 días)
  const plainRefresh = crypto.randomBytes(40).toString("hex");
  const hashedRefresh = crypto.createHash("sha256").update(plainRefresh).digest("hex");

  await poolCT.query(
    `
      INSERT INTO refresh_tokens
        (user_id, token, expires_at, revoked, created_at, updated_at, ip_address, user_agent)
      VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 6 HOUR), 0, NOW(), NOW(), ?, ?)
    `,
    [userId, hashedRefresh, sourceIp, userAgent]
  );

  return {
    access_token,
    refresh_token: plainRefresh, // 👈 al cliente le das el *plain*, nunca el hash
    expires_in: 3600,            // 1 hora en segundos
  };
};

// Validar access token
export const validToken = async (poolCT: Pool, bearerToken: string) => {
  const [tokenId, plainToken] = bearerToken.split("|");

  if (!tokenId || !plainToken) {
    return { isValid: false };
  }

  const hashed = crypto.createHash("sha256").update(plainToken).digest("hex");
  const [rows]: any = await poolCT.query(
    "SELECT * FROM personal_access_tokens WHERE id = ? LIMIT 1",
    [tokenId]
  );

  if (!rows.length) {
    return { isValid: false };
  };

  const tokenRow = rows[0];
  const isValid = tokenRow.token === hashed;
  const isNotExpired = !tokenRow.expires_at || new Date(tokenRow.expires_at) > new Date();

  let user;
  if(isValid){
    const [rows]: any = await poolCT.query(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [tokenRow.tokenable_id]
    );
    user = rows[0];
  }

  return { isValid, expired: !isNotExpired, user };
};

// Usar el refresh token para renovar
export const refreshAccessToken = async (
  poolCT: Pool,
  refreshTokenPlain: string,
  sourceIp: string,
  userAgent: string | null
): Promise<any> => {
  const hashedRefresh = crypto.createHash("sha256").update(refreshTokenPlain).digest("hex");

  const [rows]: any = await poolCT.query(
    `
    SELECT * FROM refresh_tokens 
    WHERE token = ? 
      AND revoked = 0
      AND expires_at > NOW()
    LIMIT 1
    `,
    [hashedRefresh]
  );

  if (!rows.length) {
    console.log("Refresh token inválido o expirado");
    return { error: "invalid_token" };
  }

  const refreshRow = rows[0];

  if (new Date(refreshRow.expires_at) < new Date()) {
    console.log("Refresh token expirado");
    return { error: "invalid_token" };
  }

  // (Opcional) rotación de refresh token: marcar el actual como usado/revocado
  await poolCT.query(
    "UPDATE refresh_tokens SET revoked = 1, updated_at = NOW() WHERE id = ?",
    [refreshRow.id]
  );

  // Generar un nuevo par de tokens
  return await generateToken(poolCT, refreshRow.user_id, sourceIp, userAgent);
};

// Revocar todos los tokens del usuario
export const destroyTokens = async (poolCT: Pool, userId: string) => {
  await poolCT.query("DELETE FROM personal_access_tokens WHERE tokenable_id = ?", [userId]);
  await poolCT.query("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);
};