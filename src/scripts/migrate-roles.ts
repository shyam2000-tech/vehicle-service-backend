import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

async function migrate() {
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'Repair-Booking-System',
    });

    try {
        console.log('Running migration to add roles to user_role enum...');
        
        // PostgreSQL doesn't allow ALTER TYPE ... ADD VALUE inside a transaction block in some versions,
        // but we can run them individually.
        await pool.query("ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'WORKSHOP_OWNER'");
        await pool.query("ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'VEHICLE_OWNER'");
        await pool.query("ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ADMIN'");
        
        console.log('✅ Migration successful!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
