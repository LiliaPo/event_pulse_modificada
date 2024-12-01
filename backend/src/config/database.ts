import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Xarxatec',
    port: 5432,
});

export default pool; 