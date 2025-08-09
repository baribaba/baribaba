// client/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // initial sample display (will fetch from API)
  fetch("/api/properties")
    .then(r => r.json())
    .then(data => {
      const homeGrid = document.getElementById("homeGrid");
      homeGrid.innerHTML = data.slice(0,6).map(p => `
        <div class="card">
          <img src="${p.main_image || 'https://via.placeholder.com/800x400?text=Property'}">
          <div class="card-body">
            <h3>${p.title}</h3>
            <p class="muted">${p.location}, ${p.city}</p>
            <p class="price">₹${Number(p.price).toLocaleString()}</p>
          </div>
        </div>
      `).join("");
    });

  document.getElementById("homeSearch").addEventListener("click", () => {
    const city = document.getElementById("homeCity").value;
    const q = document.getElementById("homeQuery").value.trim();
    const params = new URLSearchParams({ city, q });
    window.location.href = "/search.html?" + params.toString();
  });

  // tabs UI for home (optional)
  document.querySelectorAll(".tabs .tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tabs .tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
