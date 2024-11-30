export default {
    port: process.env.PORT || 3001,
    database: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432')
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'saul quique lilia',
        expiresIn: '96h'
    }
}; 