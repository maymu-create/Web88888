   // Utilities
const $ = id => document.getElementById(id);
const saveToLS = (k,v) => localStorage.setItem('notebook:'+k, JSON.stringify(v));
const loadFromLS = k => { try { return JSON.parse(localStorage.getItem('notebook:'+k)) } catch(e){return null} }
let accounts=loadFromLS('accounts')||[];
const tbody=document.querySelector('#accountTable tbody');
function renderAccounts(){
  tbody.innerHTML=''; let balance=0;
  accounts.forEach((r,i)=>{
    balance+=(+r.income||0)-(+r.expense||0);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${new Date(r.date).toLocaleDateString()}</td>
      <td>${r.desc}</td><td>${r.income}</td><td>${r.expense}</td>
      <td>${balance.toFixed(2)}</td>
      <td><button data-i=\"${i}\" class=\"btn ghost\">ลบ</button></td>`;
    tbody.appendChild(tr);
  });
  $('totalAmount').textContent=balance.toFixed(2);
  $('netBalance').textContent=balance.toFixed(2);
  saveToLS('accounts',accounts);
}
$('addRow').onclick=()=>{
  const desc=$('desc').value.trim(), income=parseFloat($('income').value)||0, expense=parseFloat($('expense').value)||0;
  if(!desc) return alert('กรุณาใส่คำอธิบาย');
  accounts.push({date:Date.now(),desc,income:income?income.toFixed(2):'',expense:expense?expense.toFixed(2):''});
  $('desc').value=$('income').value=$('expense').value='';
  renderAccounts();
}
tbody.onclick=e=>{ if(e.target.matches('button')){ accounts.splice(+e.target.dataset.i,1); renderAccounts(); } }
renderAccounts();

function toCSV(rows){ return rows.map(r=>r.map(c=>`\"${String(c||'').replace(/\"/g,'\"\"')}\"`).join(',')).join('\\n') }
$('exportCSV').onclick=()=>{
  const rows=[['Date','Description','Income','Expense']].concat(accounts.map(r=>[new Date(r.date).toLocaleString(),r.desc,r.income,r.expense]));
  const blob=new Blob([toCSV(rows)],{type:'text/csv'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='accounts.csv'; a.click();

  $('clearAll').onclick=()=>{ if(confirm('ล้างทั้งหมด?')){ localStorage.clear(); location.reload(); } }
$('clearAccounts').onclick=()=>{ if(confirm('ล้างบัญชี?')){ accounts=[]; renderAccounts(); } }

// Summary
function refreshSummary(){ $('todoCount').textContent=todos.filter(t=>!t.done).length }
refreshSummary();
 