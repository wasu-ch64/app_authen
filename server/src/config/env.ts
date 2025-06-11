import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
export { required };
// กำหนด type ให้กับ NODE_ENV เพื่อระบุค่าที่ยอมรับได้
type NodeEnv = 'development' | 'production' | 'test' | undefined;

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  NODE_ENV: process.env.NODE_ENV as NodeEnv, 
  BCRYPT_SALT: process.env.BCRYPT_SALT ? Number(process.env.BCRYPT_SALT) : 12,
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((item) => item.trim())
    : ['http://localhost:5173'],
  // ... อื่น ๆ
};
