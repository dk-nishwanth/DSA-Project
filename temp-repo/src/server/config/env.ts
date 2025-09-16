import * as dotenv from 'dotenv';

let loaded = false;

export function loadEnv() {
  if (!loaded) {
    dotenv.config();
    loaded = true;
  }
  return process.env as NodeJS.ProcessEnv & {
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
    SUPER_ADMIN_EMAIL?: string;
  };
}




