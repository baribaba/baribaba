// js/auth.js
// Provides: signInWithGoogle(), emailSignUp(), emailSignIn(), phone OTP flow.
// Uses fbAuth from firebase-config.js when available; otherwise falls back to simulated localStorage auth.

function isFirebaseReady() { return window.fbAuth && typeof window.fbAuth === 'object'; }

// Simulated simple local login (for quick local testing without Firebase)
function simulateLogin(user) {
  localStorage.setItem('bb_user', JSON.stringify(user));
  alert('Signed in (simulated) as ' + (user.name || user.email || user.phone));
  window.location.href = 'index.html';
}

// Google sign-in
async function signInWithGoogle() {
  if (!isFirebaseReady()) {
    const name = prompt("Simulated Google sign-in: enter name");
    if (name) simulateLogin({name});
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await window.fbAuth.signInWithPopup(provider);
    const user = result.user;
    localStorage.setItem('bb_user', JSON.stringify({ name: user.displayName, email: user.email }));
    window.location.href = 'index.html';
  } catch (err) {
    alert('Google sign-in error: ' + err.message);
  }
}

// Email sign-up
async function emailSignUp(email, password, name) {
  if (!isFirebaseReady()) { simulateLogin({name,email}); return; }
  try {
    const res = await window.fbAuth.createUserWithEmailAndPassword(email, password);
    await res.user.updateProfile({displayName: name});
    localStorage.setItem('bb_user', JSON.stringify({name,email}));
    window.location.href = 'index.html';
  } catch (err) { alert(err.message); }
}

// Email login
async function emailLogin(email, password) {
  if (!isFirebaseReady()) { simulateLogin({email}); return; }
  try {
    const res = await window.fbAuth.signInWithEmailAndPassword(email, password);
    const user = res.user;
    localStorage.setItem('bb_user', JSON.stringify({name:user.displayName,email:user.email}));
    window.location.href = 'index.html';
  } catch (err) { alert(err.message); }
}

// Phone OTP flow (Firebase)
let confirmationResult = null;
async function sendOtp(phone) {
  if (!isFirebaseReady()) { alert('Firebase not configured for phone OTP in local demo.'); return; }
  // render recaptcha (invisible)
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {size:'invisible'});
  try {
    confirmationResult = await fbAuth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
    alert('OTP sent to ' + phone);
  } catch (e) { alert('OTP error: ' + e.message); }
}
async function verifyOtp(code) {
  if (!confirmationResult) { alert('No OTP sent.'); return; }
  try {
    const res = await confirmationResult.confirm(code);
    const user = res.user;
    localStorage.setItem('bb_user', JSON.stringify({phone:user.phoneNumber}));
    window.location.href = 'index.html';
  } catch (e) { alert('OTP verify failed: ' + e.message); }
}

// Connect UI on the login page
document.addEventListener('DOMContentLoaded', () => {
  // Buttons / forms exist across pages
  const gbtn = document.getElementById('btnGoogle');
  if (gbtn) gbtn.addEventListener('click', signInWithGoogle);

  const loginForm = document.getElementById('emailLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPass').value;
      emailLogin(email, pass);
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const pass = document.getElementById('signupPass').value;
      emailSignUp(email, pass, name);
    });
  }

  // Phone OTP UI
  const sendOtpBtn = document.getElementById('btnSendOtp');
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phone = document.getElementById('phoneNumber').value;
      if (!phone) return alert('Enter phone with country code');
      sendOtp(phone);
    });
  }
  const verifyOtpBtn = document.getElementById('btnVerifyOtp');
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const code = document.getElementById('otpInput').value;
      if (!code) return alert('Enter OTP');
      verifyOtp(code);
    });
  }
});
