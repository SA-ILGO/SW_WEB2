require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // SJ씨가 부하 우려해서 10초로 설정
    queueLimit: 0
};
