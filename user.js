import { auth, db, onAuthStateChanged } from './auth.js';
import { collection, addDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";

window.currentUser = null;

onAuthStateChanged(auth, async (user)=>{
  if(user){
    document.getElementById("authSection").style.display="none";
    document.getElementById("userSection").style.display="block";
    const snap = await getDoc(doc(db,"Users",user.uid));
    if(snap.exists()){
      window.currentUser={uid:user.uid,name:snap.data().name};
      document.getElementById("userName").innerText=snap.data().name;
    }
  } else {
    document.getElementById("authSection").style.display="block";
    document.getElementById("userSection").style.display="none";
  }
});

document.getElementById("orderForm").addEventListener("submit",async (e)=>{
  e.preventDefault();
  const type=document.getElementById("orderType").value;
  const amount=Number(document.getElementById("orderAmount").value);
  const fufuId=document.getElementById("orderFufu").value;
  const fileInput=document.getElementById("orderFile");
  let imageURL="";
  if(fileInput.files.length>0){
    const file=fileInput.files[0];
    const storage=getStorage();
    const storageRef=ref(storage,'orders/'+Date.now()+'_'+file.name);
    await uploadBytes(storageRef,file);
    imageURL=await getDownloadURL(storageRef);
  }
  await addDoc(collection(db,"Orders"),{
    userId:window.currentUser.uid,
    userName:window.currentUser.name,
    type,
    amount,
    fufuId,
    status:"pending",
    date:new Date(),
    imageURL
  });
  alert("تم إرسال الطلب");
  document.getElementById("orderForm").reset();
});