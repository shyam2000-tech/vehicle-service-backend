import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client, Pool } = pg;
async function setupDatabase() {
    const dbName = process.env.DB_NAME || 'Repair-Booking-System';
    // 1. Connect to default 'postgres' database to create the target database
    const initialConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: 'postgres',
    };
    const client = new Client(initialConfig);
    try {
        await client.connect();
        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database "${dbName}" created successfully!`);
        }
        else {
            console.log(`Database "${dbName}" already exists.`);
        }
    }
    catch (err) {
        console.error('❌ Error during database creation:', err);
    }
    finally {
        await client.end();
    }
    // 2. Connect to the target database and run schema.sql
    console.log(`Connecting to "${dbName}" to run schema migrations...`);
    const pool = new Pool({
        ...initialConfig,
        database: dbName,
    });
    try {
        const schemaPath = path.join(__dirname, '..', 'config', 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(sql);
        console.log('✅ Schema applied successfully!');
    }
    catch (err) {
        console.error('❌ Error applying schema:', err);
    }
    finally {
        await pool.end();
    }
}
setupDatabase().catch(err => {
    console.error('❌ Setup failed:', err);
    process.exit(1);
});
