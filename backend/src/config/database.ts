import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'eventpulse',
    password: process.env.DB_PASSWORD || 'Ferranito14',
    port: parseInt(process.env.DB_PORT || '5432')
});

pool.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error conectando a PostgreSQL:', err));

export default pool; 