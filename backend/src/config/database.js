import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

pool.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error conectando a PostgreSQL:', err));

export default pool; 