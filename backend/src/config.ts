// backend/src/config.ts

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  NODE_ENV,
  BCRYPT_SALT,
  JWT_SECRET,
} = process.env;

if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB) {
  throw new Error("Missing required Postgres environment variables");
}

export const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}`;

export const CONFIG = {
  env: NODE_ENV || "development",
  bcryptSalt: Number(BCRYPT_SALT) || 10,
  jwtSecret: JWT_SECRET || "changeme",
};
