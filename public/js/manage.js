function FormatTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function ReceiptTime(){
    const currentDateTime = new Date();
    console.log("-------------------->" + FormatTime(currentDateTime));
    return FormatTime(currentDateTime);
}

// 수령 확인 번호를 문자열로 보여주기 위한 함수 
function FormatReceipt(n){
    let ReceiptRes;
    if (n === 1) {
        ReceiptRes = "완료";
    } else if (n === 0) {
        ReceiptRes = "대기";
    } else if (n === -1) {
        ReceiptRes = "불가";
    }

    return ReceiptRes;
}

// 학생회비 납부 여부 번호를 문자열로 보여주기 위한 함수 
function FormatMembership(n){
    let membershipRes;
    if (n === 0) {
        membershipRes = "X";   
    } else if (n === 1) {
        membershipRes = "O";
    } 

    return membershipRes;
}


var numberOfStudents;
// 대기자 데이터 가져오는 함수
async function FetchUsers() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        const students = data.students;
        const lines = data.lines;

        if (lines && lines.length > 0) {
            const waitingTable= document.querySelector('#waitingUserTable tbody');
            const receiptedTable= document.querySelector('#ReceiptedUserTable tbody');
            waitingTable.innerHTML = '';
            receiptedTable.innerHTML = '';

            let numberOfStudents = 0;
            lines.forEach(line => {
                const student = students.find(s => s.NUID === line.NUID);
                const row = document.createElement('tr');
                if(line.ReceiptConfirmation === 0){
                    row.innerHTML = `
                    <td>${line ? line.WaitingNumber : 'N/A'}</td>
                    <td>${line ? line.WaitingSpot : 'N/A'}</td>
                    <td>${FormatTime(line.Time) }</td>
                    <td>${student.ID}</td>
                    <td>${student.Major}</td>
                    <td>${student.Name}</td>
                    <td id="receipt-${line.NUID}">${line ? FormatReceipt(line.ReceiptConfirmation) : 'N/A'}</td>
                    <td>
                        <div class="horizonal">
                            ${line && line.WaitingSpot === 'A' ?
                                `<button class="receiptBtn" onclick="Received('${student.NUID}')">수령 완료</button>
                                <button class="receiptBtn" onclick="NotReceived('${student.NUID}')">수령 불가</button>` 
                                : ""}
                        </div>
                    </td>
                `;
                    waitingTable.appendChild(row);
                    numberOfStudents++;
                }
                else {
                    row.innerHTML = `
                    <td>${line ? line.WaitingNumber : 'N/A'}</td>
                    <td>${student.ID}</td>
                    <td>${student.Major}</td>
                    <td>${student.Name}</td>
                    <td id="receipt-${line.NUID}">${line ? FormatReceipt(line.ReceiptConfirmation) : 'N/A'}</td>
                    <td>${FormatTime(line.Time) }</td>
                    <td>${FormatTime(line.WaitingFinishedTime) }</td>
                    <td>
                            ${line && !line.ReceiptConfirmation == 0 ?
                                `<button class="receiptBtn" onclick="ReceiptReady('${student.NUID}')">수령 대기</button>` 
                                : ""}
                        </div>
                    </td>
                `;
                    receiptedTable.appendChild(row);
                }

            });
            document.getElementById("numberOfStudents").textContent = numberOfStudents;
        } else {
            console.log('No students found.');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// 수량 대기로 전환
async function ReceiptReady(NUID) {
    numberOfStudents++;
    document.getElementById("numberOfStudents").textContent = numberOfStudents;
    PlusQuantity();

    const response = await fetch(`/users/receiptReady/${NUID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

// 수령 완료 확인
async function Received(NUID) {
    numberOfStudents--;
    document.getElementById("numberOfStudents").textContent = numberOfStudents;

    MinusQuantity();
    FinishedWaitingTime(ReceiptTime(), NUID);

    const response = await fetch(`/users/received/${NUID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

// 수령 불가 확인
async function NotReceived(NUID) {
    numberOfStudents--;
    document.getElementById("numberOfStudents").textContent = numberOfStudents;
    
    const response = await fetch(`/users/notReceived/${NUID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

// 수량 -1
async function MinusQuantity() {
    const response = await fetch(`/users/minusQuantity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

// 수량 +1
async function PlusQuantity() {
    const response = await fetch(`/users/plusQuantity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

// 수량 데이터 가져오기
async function FetchQuantity() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        if (data.quantity && data.quantity.length > 0) {
            const remainingQuantity = data.quantity[0].remainingQuantity;
            document.getElementById("remainingQuantity").textContent = remainingQuantity;

            // 수량이 0이 되면 팝업창 표시
            if (parseInt(remainingQuantity) === 0) {
                showPopup();
            }
        } else {
            console.log('No quantity data available');
        }
    } catch (error) {
        console.error('Error fetching quantity data:', error);
    }
}

async function UpdateSpot() {
    
    const response = await fetch(`/users/updateSpot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

async function FinishedWaitingTime(time, NUID) {
    const response = await fetch(`/users/finishedWaitingTime/${time}/${NUID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        console.log("Receipt updated successfully");
    } else {
        console.error("Failed to update receipt");
    }
}

// 팝업창 표시 함수
function showPopup() {
    const popup = document.getElementById('analysisPopup');
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.error('Popup element not found');
    }
}

// 팝업창 닫기 함수
function closePopup() {
    const popup = document.getElementById('analysisPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// 분석 보기 함수
function viewAnalysis() {
    window.location.href = '/MMCK';
}

document.getElementById('mainpageBtn').onclick = function() {
    window.location.href = '/main'; 
};

window.onload = async () => {
    const fetchData = async () => {
        console.log("fetchData");
        await FetchUsers();   // users 데이터 가져오기
        await FetchQuantity(); // quantity 데이터 가져오기
        await UpdateSpot(); 
    };

    // 전역 스코프에 함수 할당
    window.closePopup = closePopup;
    window.viewAnalysis = viewAnalysis;

    // 초기 데이터 로드 및 주기적 업데이트
    await fetchData();
    await updateServerCompletionTime();
    setInterval(fetchData, 5000); // 과부하 우려
    setInterval(updateServerCompletionTime, 5000); // 과부하 우려


};

const mu = 6; // 서비스 속도 (명/분)
    
    // 서비스 종료 시간 계산 함수
function calculateServiceCompletionTime(n, c, mu) {
    return Math.ceil(n / c) * (1 / mu);
}

// 차트 업데이트 함수
let serviceCompletionTimeChart;
function updateServerCompletionTime() {
    console.log("updateServerCompletionTime");
    const totalCustomers = parseInt(document.getElementById('numberOfStudents').textContent);
    
    const cValues = [1, 2, 3, 4, 5];
    const completionTimes = cValues.map(c => calculateServiceCompletionTime(totalCustomers, c, mu)); // 분 단위로 변환

    // 기존 차트가 있으면 제거
    if (serviceCompletionTimeChart) {
        serviceCompletionTimeChart.destroy();
    }

    const ctx = document.getElementById('serviceCompletionTimeChart').getContext('2d');
    serviceCompletionTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: cValues,
            datasets: [{
                label: '서비스 종료 시간 (분)',
                data: completionTimes,
                borderColor: 'rgba(255, 0, 0, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '서비스 종료 시간 (분)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '서버 수 (c)'
                    }
                }
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '운영진 수에 따른 서비스 종료 시간'
                }
            }
        }
    });
    const serverCalRes = document.getElementById('serverCalRes').querySelector('tbody');
    serverCalRes.innerHTML = ''; // 기존 결과 초기화

    for (let i = 0; i < cValues.length; i++) {
        const serverTime = document.createElement('tr');
        serverTime.innerHTML = `
            <td>${cValues[i]}</td>
            <td>${completionTimes[i].toFixed(1)} 초</td>
        `;
        serverCalRes.appendChild(serverTime);
    }
}


