const STORAGE_KEY = "expense_entries_v1";
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let editingId = null;

const form = document.getElementById("entry-form");
const typeEl = document.getElementById("type");
const dateEl = document.getElementById("date");
const categoryEl = document.getElementById("category");
const descEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");

const entriesDiv = document.getElementById("entries");
const totalsDiv = document.getElementById("totals");
const monthlyDiv = document.getElementById("monthly-summary");

const filterFrom = document.getElementById("filter-from");
const filterTo = document.getElementById("filter-to");
const filterType = document.getElementById("filter-type");
const clearFilterBtn = document.getElementById("clear-filter");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function render() {
  // filter
  let list = [...entries];
  if (filterType.value !== "all") list = list.filter(e => e.type === filterType.value);
  if (filterFrom.value) list = list.filter(e => e.date >= filterFrom.value);
  if (filterTo.value) list = list.filter(e => e.date <= filterTo.value);

  // render entries
  entriesDiv.innerHTML = "";
  list.forEach(e => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div>
        <div><strong>${e.category}</strong> (${e.date})</div>
        <div style="font-size:13px;color:#555">${e.description}</div>
      </div>
      <div>
        <div class="${e.type}">${e.type === "income" ? "+" : "-"}${Number(e.amount).toLocaleString()}</div>
        <button onclick="editEntry(${e.id})" class="secondary">แก้ไข</button>
        <button onclick="deleteEntry(${e.id})" class="danger">ลบ</button>
      </div>
    `;
    entriesDiv.appendChild(div);
  });

  // totals
  const income = list.filter(e => e.type === "income").reduce((s, x) => s + Number(x.amount), 0);
  const expense = list.filter(e => e.type === "expense").reduce((s, x) => s + Number(x.amount), 0);
  totalsDiv.innerHTML = `
    รายได้: ${income.toLocaleString()} บาท<br>
    ค่าใช้จ่าย: ${expense.toLocaleString()} บาท<br>
    คงเหลือ: ${(income - expense).toLocaleString()} บาท
  `;

  // monthly summary
  const map = {};
  entries.forEach(e => {
    const m = e.date.slice(0, 7);
    if (!map[m]) map[m] = { income: 0, expense: 0 };
    map[m][e.type] += Number(e.amount);
  });
  monthlyDiv.innerHTML = "";
  Object.keys(map).sort((a,b)=>b.localeCompare(a)).forEach(m => {
    const row = document.createElement("div");
    row.innerHTML = `${m} → รายได้ ${map[m].income.toLocaleString()} • ค่าใช้จ่าย ${map[m].expense.toLocaleString()} • คงเหลือ ${(map[m].income - map[m].expense).toLocaleString()}`;
    monthlyDiv.appendChild(row);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const entry = {
    id: editingId || Date.now(),
    type: typeEl.value,
    date: dateEl.value,
    category: categoryEl.value,
    description: descEl.value,
    amount: parseFloat(amountEl.value || 0)
  };
  if (editingId) {
    entries = entries.map(it => it.id === editingId ? entry : it);
    editingId = null;
    submitBtn.textContent = "เพิ่มรายการ";
  } else {
    entries.unshift(entry);
  }
  save();
  form.reset();
  render();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  editingId = null;
  submitBtn.textContent = "เพิ่มรายการ";
});

clearFilterBtn.addEventListener("click", () => {
  filterFrom.value = "";
  filterTo.value = "";
  filterType.value = "all";
  render();
});

function editEntry(id) {
  const e = entries.find(it => it.id === id);
  if (!e) return;
  typeEl.value = e.type;
  dateEl.value = e.date;
  categoryEl.value = e.category;
  descEl.value = e.description;
  amountEl.value = e.amount;
  editingId = id;
  submitBtn.textContent = "บันทึกการแก้ไข";
}

function deleteEntry(id) {
  if (!confirm("ลบรายการนี้จริงหรือไม่?")) return;
  entries = entries.filter(e => e.id !== id);
  save();
  render();
}

// เริ่มต้น
render();