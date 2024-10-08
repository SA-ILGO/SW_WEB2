const mysql = require('mysql2');
const dbConfig = require('./config/database');
const path = require('path');
const fs = require('fs');

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

const SetTotalQuantity = async (num) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE quantity SET totalQuantity = ?', [num]);
    console.log(rows);
    return rows;
  };

const SetServerNum = async (num) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('UPDATE quantity SET serverNum = ?', [num]);
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

// const InitialWaitingTime = async (time, NUID) => {
//     const promisePool = pool.promise();
//     const [rows] = await promisePool.query('UPDATE line SET WaitingInitialTime = ? WHERE NUID = ?', [time, NUID]);
//     console.log(rows);
//     return rows;
// };
//

// 새로운 데이터를 추가할 때 '초기예상대기시간'을 설정하기 위한 메서드

// MMCK.html에서 mu 값을 추출하는 헬퍼 함수
function extractMuValue(htmlContent) {
    const muMatch = htmlContent.match(/mu\s*=\s*(\d+(\.\d+)?)/);
    return muMatch ? parseFloat(muMatch[1]) : null;
}

// MMCK 모델을 사용하여 대기 시간을 계산하는 헬퍼 함수
function calculateMMCKWaitTime(n, c, mu) {
    // MMCK 모델 계산 구현
    const lambda = n / (c * mu);
    const rho = lambda / mu;
    const waitTime = (rho ** (c + 1)) / (c * mu * (1 - rho) ** 2);
    // 초 단위의 대기 시간을 TIME 형식으로 변환
    const hours = Math.floor(waitTime);
    const minutes = Math.floor((waitTime - hours) * 60);
    const seconds = Math.floor(((waitTime - hours) * 60 - minutes) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// const updateServerNum = async (serverNum) => {
//     const promisePool = pool.promise();
//
//     try {
//         const [result] = await promisePool.query('UPDATE quantity SET serverNum = ?', [serverNum]);
//         console.log('ServerNum updated:', result);
//         return result;
//     } catch (error) {
//         console.error('Error in updateServerNum:', error);
//         throw error;
//     }
// };


  
  
  module.exports = 
  {
    ReceiptReady, Received, NotReceived, MinusQuantity, PlusQuantity, SetQuantity, UpdateSpot, FinishedWaitingTime, SetServerNum, SetTotalQuantity
  };
   