import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  PORT: process.env['PORT'] || 3000,
  JWT_SECRET: process.env['JWT_SECRET'] || 'default-secret',
  NODE_ENV: process.env['NODE_ENV'],
  BCRYPT_SALT: Number(process.env['BCRYPT_SALT']) || 12,
  CORS_ORIGIN: process.env['CORS_ORIGIN'] ? process.env['CORS_ORIGIN'].split(',') : ['http://localhost:5173'],
};