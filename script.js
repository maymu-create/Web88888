   const STORAGE_KEY = "expense_entries_simple";
    let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    let editingId = null;

    const form = document.getElementById("entry-form");
    const typeEl = document.getElementById("type");
    const dateEl = document.getElementById("date");
    const amountEl = document.getElementById("amount");
    const submitBtn = document.getElementById("submit-btn");
    const resetBtn = document.getElementById("reset-btn");

    const entriesDiv = document.getElementById("entries");
    const totalsDiv = document.getElementById("totals");

    dateEl.valueAsDate = new Date();

    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function resetForm() {
      editingId = null;
      typeEl.value = "expense";
      dateEl.valueAsDate = new Date();
      amountEl.value = "";
      submitBtn.textContent = "เพิ่มรายการ";
    }

    function addOrUpdate(e) {
      e.preventDefault();
      const entry = {
        id: editingId || Date.now(),
        type: typeEl.value,
        date: dateEl.value,
        amount: parseFloat(amountEl.value) || 0
      };
      if (editingId) {
        entries = entries.map(it => it.id === editingId ? entry : it);
      } else {
        entries.unshift(entry);
      }
      save();
      render();
      resetForm();
    }

    function editEntry(id) {
      const e = entries.find(x => x.id === id);
      if (!e) return;
      editingId = id;
      typeEl.value = e.type;
      dateEl.value = e.date;
      amountEl.value = e.amount;
      submitBtn.textContent = "บันทึกการแก้ไข";
    }

    function deleteEntry(id) {
      if (!confirm("ลบรายการนี้?")) return;
      entries = entries.filter(it => it.id !== id);
      save();
      render();
    }

    function render() {
      entriesDiv.innerHTML = "";
      if (entries.length === 0) {
        entriesDiv.innerHTML = "<p>ไม่มีรายการ</p>";
      } else {
        entries.forEach(it => {
          const div = document.createElement("div");
          div.className = "entry";
          div.innerHTML = `
            <div>${it.date}</div>
            <div class="${it.type}">${it.type === 'income' ? '+' : '-'}${it.amount.toLocaleString()}</div>
            <div>
              <button onclick="editEntry(${it.id})" class="secondary">แก้ไข</button>
              <button onclick="deleteEntry(${it.id})" class="danger">ลบ</button>
            </div>`;
          entriesDiv.appendChild(div);
        });
      }
      renderTotals();
    }

    function renderTotals() {
      const income = entries.filter(it => it.type === "income").reduce((s,x)=>s+x.amount,0);
      const expense = entries.filter(it => it.type === "expense").reduce((s,x)=>s+x.amount,0);
      totalsDiv.innerHTML = `รายรับ: ${income.toLocaleString()} บาท<br>รายจ่าย: ${expense.toLocaleString()} บาท<br>คงเหลือ: ${(income-expense).toLocaleString()} บาท`;
    }

    form.addEventListener("submit", addOrUpdate);
    resetBtn.addEventListener("click", resetForm);

    render();
  </script></body>
</html>