// client/js/property.js
(async function(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) { document.getElementById("propTitle").innerText = "Property not found"; return; }

  try {
    const res = await fetch("/api/properties/" + id);
    if (!res.ok) { document.getElementById("propTitle").innerText = "Not found"; return; }
    const p = await res.json();

    document.getElementById("propTitle").innerHTML = `<h1>${p.title}</h1><p>${p.location}, ${p.city}</p><h2 style="color:var(--accent)">₹${Number(p.price).toLocaleString()}</h2>`;

    const gallery = document.getElementById("gallery");
    const img = p.main_image || "/images/kolkata-flat-1.jpg";
    gallery.innerHTML = `<img src="${img}" alt="">`;

    document.getElementById("info").innerHTML = `
      <h3>Details</h3>
      <p>${p.description || ""}</p>
      <ul>
        <li>Type: ${p.property_type}</li>
        <li>Bedrooms: ${p.bedrooms || "-"}</li>
        <li>Bathrooms: ${p.bathrooms || "-"}</li>
        <li>Area: ${p.area || "-"} sq ft</li>
      </ul>
    `;

    document.getElementById("contactBox").innerHTML = `
      <div style="background:#fff;padding:12px;border-radius:8px;">
        <h3>Contact</h3>
        <p>To inquire, call or email the lister (demo): help@baribaba.com</p>
      </div>`;
  } catch (e) {
    document.getElementById("propTitle").innerText = "Error loading";
  }
})();
