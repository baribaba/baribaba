// client/js/search.js
async function fetchProps(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch("/api/properties/search?" + qs);
  return res.json();
}

function cardHtml(p) {
  const img = p.main_image || "/images/kolkata-flat-1.jpg";
  return `
  <div class="card">
    <img src="${img}" alt="${escapeHtml(p.title)}">
    <div class="card-body">
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.location)}, ${escapeHtml(p.city)}</p>
      <p class="price">₹${Number(p.price).toLocaleString()}</p>
      <a href="/property.html?id=${p.id}">View Details</a>
    </div>
  </div>`;
}

function escapeHtml(s){ return (s||"").toString().replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

async function loadFromUrlParams(){
  const urlParams = new URLSearchParams(window.location.search);
  const params = {
    city: urlParams.get("city") || "",
    q: urlParams.get("q") || "",
    type: urlParams.get("type") || ""
  };
  document.getElementById("citySelect").value = params.city;
  document.getElementById("queryInput").value = params.q;
  document.getElementById("typeSelect").value = params.type;
  await doSearch();
}

async function doSearch(){
  const city = document.getElementById("citySelect").value;
  const q = document.getElementById("queryInput").value;
  const type = document.getElementById("typeSelect").value;
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;
  const sort = document.getElementById("sortSelect").value;

  const params = { city, q, type, sort };
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;

  const data = await fetchProps(params);
  const container = document.getElementById("results");
  if (!data.length) container.innerHTML = "<p style='padding:20px'>No results</p>";
  else container.innerHTML = data.map(cardHtml).join("");
}

document.getElementById("searchBtn").addEventListener("click", doSearch);
document.getElementById("applyBtn").addEventListener("click", doSearch);

loadFromUrlParams();
