const { Pool } = require('pg');

// Replace the connection details with your PostgreSQL database information
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: '',
    port: 5432, // Default PostgreSQL port
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Export the pool for use in other modules
module.exports = pool;
