import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'estoque',
    password: process.env.DB_PASSWORD || 'senha123',
    port: process.env.DB_PORT || 5432,
});

export default pool;