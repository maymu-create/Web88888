// เก็บข้อมูลไว้ใน Local Storage
let accountData = JSON.parse(localStorage.getItem("accounts")) || [];
let balance = 0;

// ฟังก์ชันเพิ่มแถวใหม่
function addRow() {
  const desc = document.getElementById("desc").value.trim();
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expense = parseFloat(document.getElementById("expense").value) || 0;
  const date = new Date().toLocaleDateString();

  balance += income - expense;

  const row = {
    date, desc, income, expense, balance
  };

  accountData.push(row);
  saveData();
  renderTable();
  
  // เคลียร์ช่อง input
  document.getElementById("desc").value = "";
  document.getElementById("income").value = "";
  document.getElementById("expense").value = "";
}

// ฟังก์ชันแสดงผลในตาราง
function renderTable() {
  const tbody = document.querySelector("#accountTable tbody");
  tbody.innerHTML = "";
  balance = 0;

  accountData.forEach((item, index) => {
    balance += item.income - item.expense;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.desc}</td>
      <td>${item.income.toFixed(2)}</td>
      <td>${item.expense.toFixed(2)}</td>
      <td>${balance.toFixed(2)}</td>
      <td><button onclick="deleteRow(${index})">ลบ</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent = balance.toFixed(2);
}

// ลบแถว
function deleteRow(index) {
  accountData.splice(index, 1);
  saveData();
  renderTable();
}

// ล้างบัญชี
document.getElementById("clearAccounts").onclick = () => {
  if (confirm("คุณต้องการล้างบัญชีทั้งหมดหรือไม่?")) {
    accountData = [];
    saveData();
    renderTable();
  }
};

// Export CSV
document.getElementById("exportCSV").onclick = () => {
  let csv = "วันที่,คำอธิบาย,รายรับ,รายจ่าย,ยอดคงเหลือ\n";
  accountData.forEach(r => {
    csv += `${r.date},${r.desc},${r.income},${r.expense},${r.balance}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "account.csv";
  a.click();
};

// Save ลง Local Storage
function saveData() {
  localStorage.setItem("accounts", JSON.stringify(accountData));
}

// โหลดตอนเปิดหน้าเว็บ
document.getElementById("addRow").onclick = addRow;
window.onload = renderTable;