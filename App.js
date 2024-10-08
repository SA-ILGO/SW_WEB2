const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');
const usersRouter = require('./usersRouter')

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());  // 모든 요청에 대해 CORS 허용


app.use(express.static('public'));
app.use(express.static('Build'));

app.use(`/users`, usersRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/linesong', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/data', async (req, res) => {
    console.log('Received request for /api/data');
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [quantity] = await connection.execute('SELECT * FROM quantity');
        const [students] = await connection.execute('SELECT * FROM student');
        const [lines] = await connection.execute('SELECT * FROM line ORDER BY Time ASC');
        res.json({ quantity, students, lines });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    } finally {
        await connection.end();
    }
});

app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
    });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}/main`);
});

app.get('/MMCK', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'MMCK.html'));
});

app.use('/src', express.static(path.join(__dirname, 'src')));

// node app.js (터미널에서 이 코드로 실행)
//http://127.0.0.1:3000