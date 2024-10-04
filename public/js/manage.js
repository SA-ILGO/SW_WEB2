function FormatTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}<br>${hours}:${minutes}:${seconds}`;
}

function ReceiptTime(){
    const currentDateTime = new Date();

    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log(formattedDateTime);
    return formattedDateTime;
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

        if (students && students.length > 0) {
            const waitingTable= document.querySelector('#waitingUserTable tbody');
            const receiptedTable= document.querySelector('#ReceiptedUserTable tbody');
            waitingTable.innerHTML = ''; 
            receiptedTable.innerHTML = ''; 

            students.forEach(student => {
                // 동일한 NUID를 가진 line을 찾음
                const line = lines.find(l => l.NUID === student.NUID);
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${line ? line.WaitingNumber : 'N/A'}</td>
                    <td>${line ? line.WaitingSpot : 'N/A'}</td>
                    <td>${FormatTime(line.Time)}</td>
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
                            ${line && !line.ReceiptConfirmation == 0 ?
                                `<button class="receiptBtn" onclick="ReceiptReady('${student.NUID}')">수령 대기</button>` 
                                : ""}
                        </div>
                    </td>
                `;
                if(line.ReceiptConfirmation == 0){
                    waitingTable.appendChild(row);
                } 
                else {
                    receiptedTable.appendChild(row);
                }
                
            });
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

    console.log("ReceiptReady NUID" + NUID);
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
    console.log("Received NUID" + NUID);
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
        const response = await fetch('/api/data'); // 데이터 가져오기
        const data = await response.json(); // JSON으로 파싱
        
        if (data.quantity) {
            document.getElementById("remainingQuantity").textContent = data.quantity[0].remainingQuantity;  
        } else {
            console.log('No quantity data available');
        }
    } catch (error) {
        console.error('Error fetching quantity data:', error); // 에러 처리
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

document.getElementById('mainpageBtn').onclick = function() {
    window.location.href = '/main'; 
};

window.onload = async () => {
    UpdateSpot();
    FetchUsers();
    FetchQuantity();

    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        const lines = data.lines;

        numberOfStudents = lines.length;
        document.getElementById("numberOfStudents").textContent = numberOfStudents;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    
    const fetchData = async () => {
        await FetchUsers();   // users 데이터 가져오기
        await FetchQuantity(); // quantity 데이터 가져오기
        await UpdateSpot();
    };

    // 10초마다 fetchData 함수 호출
    setInterval(fetchData, 500); // 과부화 걱정 돼서 우선 10초로 진행 
};