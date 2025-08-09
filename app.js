// js/app.js
document.addEventListener("DOMContentLoaded", () => {

  // ===== SAMPLE DATA =====
  // Replace or extend with your real data or fetch from backend.
  const sampleProperties = [
    { id:1, title:"2 BHK Flat in New Town", price:4500000, city:"Kolkata", location:"New Town", type:"Buy", img:"images/prop1.jpg" },
    { id:2, title:"3 BHK Flat in Rajarhat", price:6000000, city:"Kolkata", location:"Rajarhat", type:"Buy", img:"images/prop2.jpg" },
    { id:3, title:"Furnished PG in Behala", price:5500, city:"Kolkata", location:"Behala", type:"PG", img:"images/prop1.jpg" },
    { id:4, title:"Plot 500 sq yd in Dwarka", price:12000000, city:"Delhi", location:"Dwarka", type:"Plots", img:"images/prop2.jpg" }
  ];

  // Elements
  const tabs = document.querySelectorAll(".tab");
  const citySelect = document.getElementById("citySelect");
  const cityName = document.getElementById("city-name");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const chips = document.querySelectorAll(".chip");
  const resultsGrid = document.getElementById("resultsGrid");
  const resultsTitle = document.getElementById("resultsTitle");

  // Tab behavior
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
  }));

  // City name update
  citySelect.addEventListener("change", () => {
    cityName.textContent = citySelect.value;
  });

  // Render results
  function renderResults(list, qText = "") {
    resultsGrid.innerHTML = "";
    if (!list.length) {
      resultsGrid.innerHTML = "<p>No properties found.</p>";
      resultsTitle.textContent = `No results for "${qText}"`;
      return;
    }
    resultsTitle.textContent = qText ? `Results for "${qText}"` : "Search results";
    list.forEach(p => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <img src="${p.img || 'images/prop1.jpg'}" alt="${p.title}">
        <div class="card-body">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="muted">${escapeHtml(p.location)}, ${escapeHtml(p.city)}</p>
          <p class="price">₹${Number(p.price).toLocaleString()}</p>
        </div>
      `;
      resultsGrid.appendChild(el);
    });
  }

  function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // Search logic
  function doSearch() {
    const activeTab = document.querySelector(".tab.active");
    const type = activeTab ? activeTab.dataset.type : null;
    const city = citySelect.value;
    const q = searchInput.value.trim().toLowerCase();

    let filtered = sampleProperties.filter(p => {
      let ok = true;
      if (type) ok = ok && p.type.toLowerCase() === type.toLowerCase();
      if (city) ok = ok && p.city.toLowerCase() === city.toLowerCase();
      if (q) ok = ok && (p.location.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
      return ok;
    });

    renderResults(filtered, q || `${type} in ${city}`);
  }

  // Hook search button & enter key
  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });

  // Chips quick search
  chips.forEach(c => c.addEventListener("click", () => {
    searchInput.value = c.textContent;
    doSearch();
  }));

  // Initial: show all buy in selected city
  renderResults(sampleProperties.filter(p => p.type === "Buy"), "Top listings");

  // ===== AUTH MODAL =====
  const authModal = document.getElementById("authModal");
  const btnLogin = document.getElementById("btnLogin");
  const closeAuth = document.getElementById("closeAuth");
  const googleBtn = document.getElementById("googleSignIn");
  const sendOtp = document.getElementById("sendOtp");
  const verifyOtp = document.getElementById("verifyOtp");
  const otpRow = document.getElementById("otpRow");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const otpInput = document.getElementById("otpInput");
  const authStatus = document.getElementById("authStatus");

  btnLogin.addEventListener("click", () => { authModal.setAttribute("aria-hidden","false"); });
  closeAuth.addEventListener("click", () => { authModal.setAttribute("aria-hidden","true"); });

  // Google Sign-in
  googleBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      authStatus.textContent = `Signed in as ${user.displayName || user.phoneNumber || user.email}`;
      authModal.setAttribute("aria-hidden","true");
      btnLogin.textContent = "Profile";
    } catch (err) {
      console.error(err);
      authStatus.textContent = `Error: ${err.message}`;
    }
  });

  // Phone OTP
  // Render reCAPTCHA
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => { /* reCAPTCHA solved */ }
  });

  sendOtp.addEventListener("click", async () => {
    const phone = phoneNumberInput.value.trim();
    if (!phone) { authStatus.textContent = "Enter phone number (with country code)"; return; }
    authStatus.textContent = "Sending OTP...";
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phone, appVerifier);
      window.confirmationResult = confirmationResult;
      authStatus.textContent = "OTP sent. Enter code.";
      otpRow.style.display = "block";
    } catch (err) {
      console.error(err);
      authStatus.textContent = "Error sending OTP: " + err.message;
    }
  });

  verifyOtp.addEventListener("click", async () => {
    const code = otpInput.value.trim();
    if (!code) { authStatus.textContent = "Enter OTP code."; return; }
    try {
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      authStatus.textContent = `Signed in as ${user.phoneNumber || user.displayName || user.email}`;
      authModal.setAttribute("aria-hidden","true");
      btnLogin.textContent = "Profile";
    } catch (err) {
      console.error(err);
      authStatus.textContent = "OTP verification failed: " + err.message;
    }
  });

  // optional: auth state change listener
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      btnLogin.textContent = user.displayName || user.phoneNumber || "Profile";
    } else {
      btnLogin.textContent = "Sign In";
    }
  });

});
