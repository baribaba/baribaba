// client/js/property.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const wrap = document.getElementById("propWrap");

  if (!id) { wrap.innerHTML = "<p>Property ID missing</p>"; return; }

  try {
    const res = await fetch("/api/properties/" + id);
    if (!res.ok) throw new Error("Not found");
    const p = await res.json();

    wrap.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
        <div>
          <img src="${p.main_image || 'https://via.placeholder.com/1200x600'}" style="width:100%;border-radius:8px">
          <h2>${p.title}</h2>
          <p class="muted">${p.location}, ${p.city}</p>
          <p>₹${Number(p.price).toLocaleString()}</p>
          <h3>Description</h3>
          <p>${p.description || ''}</p>
        </div>
        <aside>
          <div class="form-card">
            <h3>Contact</h3>
            <p>Email: help@baribaba.com</p>
            <p>Phone: +91 90000 00000</p>
            <a href="tel:+919000000000" class="btn-post">Call</a>
          </div>
        </aside>
      </div>
    `;
  } catch (err) {
    wrap.innerHTML = "<p>Could not load property</p>";
  }
});
