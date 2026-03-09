import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDK1wkigSJerC3U-DPDV2KEPb8fxveOii4",
  authDomain: "nasr-card.firebaseapp.com",
  projectId: "nasr-card",
  storageBucket: "nasr-card.firebasestorage.app",
  messagingSenderId: "680244255141",
  appId: "1:680244255141:web:0633bea1f270cfe407304c",
  measurementId: "G-GJLLEQ4D49"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// تسجيل مستخدم جديد
export async function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "Users", user.uid), { name, email });
    alert("تم إنشاء الحساب بنجاح!");
  } catch(e){ alert("خطأ: "+e.message); }
}

// تسجيل دخول Email
export async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("تم تسجيل الدخول!");
  } catch(e){ alert("خطأ: "+e.message); }
}

// تسجيل دخول Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db,"Users",user.uid);
    const snap = await getDoc(userRef);
    if(!snap.exists()) await setDoc(userRef, {name:user.displayName,email:user.email});
    alert("تم تسجيل الدخول بنجاح!");
  } catch(e){ alert("خطأ: "+e.message); }
}

export { onAuthStateChanged };