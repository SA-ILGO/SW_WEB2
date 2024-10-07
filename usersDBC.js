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

const addToLine = async (NUID, c) => {
    const promisePool = pool.promise();

    try {
        // 트랜잭션 시작
        await promisePool.query('START TRANSACTION');

        // 대기 중인 고객 수 계산 (ReceiptConfirmation이 0인 행의 수)
        const [waitingCount] = await promisePool.query('SELECT COUNT(*) as count FROM line WHERE ReceiptConfirmation = 0');
        const n = waitingCount[0].count;

        // MMCK.html 파일 읽기
        const mmckPath = path.join(__dirname, 'public', 'MMCK.html');
        const mmckContent = fs.readFileSync(mmckPath, 'utf8');

        // MMCK.html에서 mu 값 추출
        const mu = extractMuValue(mmckContent);

        // MMCK 모델을 사용하여 WaitingInitialTime 계산
        const waitingInitialTime = calculateMMCKWaitTime(n, c, mu);

        // 현재 시간 가져오기
        const [currentTime] = await promisePool.query('SELECT CURRENT_TIMESTAMP() as now');
        const now = currentTime[0].now;

        // 새 행 삽입
        const [insertResult] = await promisePool.query(
            'INSERT INTO line (NUID, Time, WaitingNumber, WaitingInitialTime) VALUES (?, ?, ?, ?)',
            [NUID, now, n + 1, waitingInitialTime]
        );

        // 트랜잭션 커밋
        await promisePool.query('COMMIT');

        console.log(insertResult);
        return insertResult;
    } catch (error) {
        // 오류 발생 시 롤백
        await promisePool.query('ROLLBACK');
        console.error('Error in addToLine:', error);
        throw error;
    }
};

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
    ReceiptReady, Received, NotReceived, MinusQuantity, PlusQuantity, SetQuantity, UpdateSpot, FinishedWaitingTime, SetServerNum
  };
   