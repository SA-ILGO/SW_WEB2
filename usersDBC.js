const mysql = require('mysql2');
const dbConfig = require('./config/database');

// Create the connection pool using the configuration
const pool = mysql.createPool(dbConfig);

const ReceiptReady = async (NUID) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE line SET ReceiptConfirmation = 0 WHERE NUID = ?', [NUID]);
    console.log(rows);
    return rows;
};

const Received = async (NUID) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE line SET WaitingSpot = "", ReceiptConfirmation = 1 WHERE NUID = ?', [NUID]);
    console.log(rows);
    return rows;
};

const NotReceived = async (NUID) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE line SET WaitingSpot = "", ReceiptConfirmation = -1 WHERE NUID = ?', [NUID]);
    console.log(rows);
    return rows;
};

const PlusQuantity = async () => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE quantity SET remainingQuantity = remainingQuantity + 1');
    console.log(rows);
    return rows;
};

const MinusQuantity = async () => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE quantity SET remainingQuantity = remainingQuantity - 1');
    console.log(rows);
    return rows;
};

const SetQuantity = async (num) => {
  const promisePool = pool.promise(); 
  const [rows] = await promisePool.query('UPDATE quantity SET remainingQuantity = ?', [num]);
  console.log(rows);
  return rows;
};

const UpdateSpot = async () => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('CALL UpdateSpot()');
    console.log(rows);
    return rows;
};

const FinishedWaitingTime = async (time, NUID) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE line SET WaitingFinishedTime = ? WHERE NUID = ?', [time, NUID]);
    console.log(rows);
    return rows;
};


  
  
  module.exports = 
  {
    ReceiptReady, Received, NotReceived, MinusQuantity, PlusQuantity, SetQuantity, UpdateSpot, FinishedWaitingTime
  };
   