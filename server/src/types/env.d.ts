// env.d.ts
declare namespace NodeJS {
  
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test';
    BCRYPT_SALT?: string;
    JWT_SECRET: string;
    PORT?: string;
    CORS_ORIGIN?: string;
  }
  
}
