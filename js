// client/js/search.js
document.addEventListener("DOMContentLoaded", () => {
  const cityFilter = document.getElementById("cityFilter");
  const typeFilter = document.getElementById("typeFilter");
  const qFilter = document.getElementById("qFilter");
  const applyBtn = document.getElementById("applyBtn");
  const resultsGrid = document.getElementById("resultsGrid");
  const resultsTitle = document.getElementById("resultsTitle");

  function render(items) {
    resultsGrid.innerHTML = items.map(p => `
      <div class="card">
        <img src="${p.main_image || 'https://via.placeholder.com/800x400?text=Property'}">
        <div class="card-body">
          <h3>${p.title}</h3>
          <p class="muted">${p.location}, ${p.city}</p>
          <p class="price">₹${Number(p.price).toLocaleString()}</p>
          <a href="/property.html?id=${p.id}">View Details</a>
        </div>
      </div>
    `).join("");
  }

  async function fetchAndRender() {
    const params = new URLSearchParams();
    if (cityFilter.value) params.set("city", cityFilter.value);
    if (typeFilter.value) params.set("type", typeFilter.value);
    if (qFilter.value) params.set("q", qFilter.value);

    const res = await fetch("/api/properties/search?" + params.toString());
    const data = await res.json();
    resultsTitle.textContent = `Results (${data.length})`;
    render(data);
  }

  applyBtn.addEventListener("click", fetchAndRender);

  // load from URL query on page open
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("city")) cityFilter.value = urlParams.get("city");
  if (urlParams.get("type")) typeFilter.value = urlParams.get("type");
  if (urlParams.get("q")) qFilter.value = urlParams.get("q");

  fetchAndRender();
});
