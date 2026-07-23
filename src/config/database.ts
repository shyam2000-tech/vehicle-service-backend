import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 10),
  database: env.DB_NAME,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
});

// Optional: Test connection on startup
pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });