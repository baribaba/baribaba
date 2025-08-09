// js/search.js
document.addEventListener("DOMContentLoaded", async () => {
  // sample fallback dataset (same as main)
  const sample = window.__BB_SAMPLE || [
    {id:1,title:"2 BHK Flat, New Town",city:"Kolkata",location:"New Town",type:"Buy",price:4500000,img:"assets/images/prop1.jpg"}
    // ...
  ];

  // read params
  const params = new URLSearchParams(window.location.search);
  const city = (params.get("city") || "").toLowerCase();
  const q = (params.get("q") || params.get("query") || "").toLowerCase();
  const type = (params.get("type") || "").toLowerCase();

  // If firebase is configured and you want to use Firestore, you can query here.
  // For now we filter local sample.
  const filtered = sample.filter(p => {
    if (city && p.city.toLowerCase() !== city) return false;
    if (type && p.type.toLowerCase() !== type) return false;
    if (q && !(p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))) return false;
    return true;
  });

  const titleElem = document.getElementById("resultsTitle");
  titleElem.textContent = `Results ${city ? 'in ' + city : ''} ${q ? 'for "' + q + '"' : ''}`.trim();

  const grid = document.getElementById("resultsGrid");
  if (!filtered.length) grid.innerHTML = "<p>No properties found.</p>";
  else grid.innerHTML = filtered.map(p => `
    <div class="col-md-4">
      <div class="property-card">
        <img src="${p.img}" alt="${p.title}">
        <div class="property-body">
          <h5>${p.title}</h5>
          <p class="muted">${p.location}, ${p.city}</p>
          <p class="price">₹${Number(p.price).toLocaleString()}</p>
          <a class="btn btn-sm btn-primary" href="property.html?id=${p.id}">View Details</a>
        </div>
      </div>
    </div>
  `).join('');
});
