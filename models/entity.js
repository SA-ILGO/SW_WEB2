const mysql = require('mysql2');
const dbConfig = require('config/database.js');

const pool = mysql.createPool(dbConfig).promise();

// Student Entity
const Student = {
    tableName: 'student',
    columns: {
        ID: { type: 'VARCHAR(20)', primaryKey: true },
        Name: { type: 'VARCHAR(100)', notNull: true },
        NUID: { type: 'VARCHAR(50)', unique: true },
        Major: { type: 'VARCHAR(100)' },
        Membership: { type: 'TINYINT(1)', default: 0 }
    },
    create: async function(student) {
        const query = 'INSERT INTO student (ID, Name, NUID, Major, Membership) VALUES (?, ?, ?, ?, ?)';
        const values = [student.ID, student.Name, student.NUID, student.Major, student.Membership];
        return pool.query(query, values);
    },
    findById: async function(id) {
        const [rows] = await pool.query('SELECT * FROM student WHERE ID = ?', [id]);
        return rows[0];
    },
    update: async function(id, student) {
        const query = 'UPDATE student SET Name = ?, NUID = ?, Major = ?, Membership = ? WHERE ID = ?';
        const values = [student.Name, student.NUID, student.Major, student.Membership, id];
        return pool.query(query, values);
    },
    delete: async function(id) {
        return pool.query('DELETE FROM student WHERE ID = ?', [id]);
    }
};

// Line Entity
const Line = {
    tableName: 'line',
    columns: {
        NUID: { type: 'VARCHAR(50)', primaryKey: true },
        Time: { type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
        WaitingNumber: { type: 'INT', autoIncrement: true },
        WaitingSpot: { type: 'CHAR(1)' }, // from A to T (20counts)
        ReceiptConfirmation: { type: 'TINYINT(1)', default: null }
    },
    create: async function(line) {
        const query = 'INSERT INTO line (NUID, WaitingSpot, ReceiptConfirmation) VALUES (?, ?, ?)';
        const values = [line.NUID, line.WaitingSpot, line.ReceiptConfirmation];
        return pool.query(query, values);
    },
    findByNUID: async function(nuid) {
        const [rows] = await pool.query('SELECT * FROM line WHERE NUID = ?', [nuid]);
        return rows[0];
    },
    update: async function(nuid, line) {
        const query = 'UPDATE line SET WaitingSpot = ?, ReceiptConfirmation = ? WHERE NUID = ?';
        const values = [line.WaitingSpot, line.ReceiptConfirmation, nuid];
        return pool.query(query, values);
    },
    delete: async function(nuid) {
        return pool.query('DELETE FROM line WHERE NUID = ?', [nuid]);
    },
    updateWaitingSpot: async function() {
        // This function updates the WaitingSpot based on WaitingNumber and ReceiptConfirmation
        const query = `
      UPDATE line
      SET WaitingSpot = CHAR(64 + 
        (SELECT COUNT(*) 
         FROM (SELECT * FROM line) AS l2 
         WHERE l2.WaitingNumber <= line.WaitingNumber 
           AND (l2.ReceiptConfirmation IS NULL OR l2.ReceiptConfirmation = 0)))
      WHERE ReceiptConfirmation IS NULL OR ReceiptConfirmation = 0
    `;
        return pool.query(query);
    }
};

module.exports = {
    Student,
    Line
};