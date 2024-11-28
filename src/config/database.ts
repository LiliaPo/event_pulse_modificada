import { Pool, PoolConfig } from 'pg';

export const config: PoolConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'tu_contraseña',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'eventpulse'
};

const pool = new Pool(config);

export default pool; 