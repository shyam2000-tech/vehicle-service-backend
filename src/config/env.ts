import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  PORT: getEnv('PORT', false) || '5000',
  DATABASE_URL: getEnv('DATABASE_URL', false),
  DB_HOST: getEnv('DB_HOST', false) || 'localhost',
  DB_PORT: getEnv('DB_PORT', false) || '5432',
  DB_USER: getEnv('DB_USER', false) || 'postgres',
  DB_PASSWORD: getEnv('DB_PASSWORD', false) || 'postgres',
  DB_NAME: getEnv('DB_NAME', false) || 'postgres',
  DB_SSL: getEnv('DB_SSL', false) === 'true',
  JWT_SECRET: getEnv('ACCESS_TOKEN_SECRET', false),
};