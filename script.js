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