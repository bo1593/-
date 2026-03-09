import { db } from './auth.js';
import { doc, getDoc, updateDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

export async function getSettings(){
  const settingsRef=doc(db,"Settings","Main");
  const snap=await getDoc(settingsRef);
  if(snap.exists()){
    const data=snap.data();
    document.getElementById("cashNumber").innerText=data.cashNumber;
    document.getElementById("price100").innerText=data.prices['100']+" جنيه";
    document.getElementById("price500").innerText=data.prices['500']+" جنيه";
    document.getElementById("price1000").innerText=data.prices['1000']+" جنيه";
    document.getElementById("cashNumberInput").value=data.cashNumber;
    document.getElementById("price100Input").value=data.prices['100'];
    document.getElementById("price500Input").value=data.prices['500'];
    document.getElementById("price1000Input").value=data.prices['1000'];
  }
}

export async function updatePrices(){
  const settingsRef=doc(db,"Settings","Main");
  await updateDoc(settingsRef,{
    prices:{
      '100':Number(document.getElementById("price100Input").value),
      '500':Number(document.getElementById("price500Input").value),
      '1000':Number(document.getElementById("price1000Input").value)
    }
  });
  alert("تم تحديث الأسعار!");
  getSettings();
}

export async function updateCashNumber(){
  const settingsRef=doc(db,"Settings","Main");
  await updateDoc(settingsRef,{cashNumber:document.getElementById("cashNumberInput").value});
  alert("تم تحديث رقم المحفظة!");
  getSettings();
}

export async function getOrders(){
  const table=document.getElementById("ordersTable");
  table.querySelectorAll("tr:not(:first-child)").forEach(e=>e.remove());
  const ordersSnap=await getDocs(collection(db,"Orders"));
  ordersSnap.forEach(docSnap=>{
    const data=docSnap.data();
    const row=table.insertRow();
    row.insertCell(0).innerText=data.userName;
    row.insertCell(1).innerText=data.type;
    row.insertCell(2).innerText=data.amount;
    row.insertCell(3).innerText=data.status;
    row.insertCell(4).innerText=data.fufuId;
    row.insertCell(5).innerText=new Date(data.date.seconds*1000).toLocaleString();
    if(data.imageURL){
      const imgCell=row.insertCell(6);
      const img=document.createElement("img");
      img.src=data.imageURL;
      imgCell.appendChild(img);
    } else row.insertCell(6).innerText="-";
  });
}

getSettings();
getOrders();