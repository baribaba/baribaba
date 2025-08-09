// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // sample dataset (client-side). In production pull from Firestore.
  window.__BB_SAMPLE = [
    {id:1,title:"2 BHK Flat, New Town",city:"Kolkata",location:"New Town",type:"Buy",price:4500000,img:"assets/images/prop1.jpg",desc:"Bright 2BHK near metro."},
    {id:2,title:"3 BHK Rajarhat Luxury",city:"Kolkata",location:"Rajarhat",type:"Buy",price:6500000,img:"assets/images/prop2.jpg",desc:"Spacious 3BHK with balcony."},
    {id:3,title:"PG Near Behala",city:"Kolkata",location:"Behala",type:"PG",price:5500,img:"assets/images/pg.jpg",desc:"Furnished PG with meals."}
  ];

  // Render featured on homepage
  if (document.getElementById("homeResults")) {
    const container = document.getElementById("homeResults");
    const html = window.__BB_SAMPLE.slice(0,3).map(p => `
      <div class="property-card">
        <img src="${p.img}" alt="">
        <div class="property-body">
          <h5>${p.title}</h5>
          <p class="muted">${p.location}, ${p.city}</p>
          <p class="price">₹${Number(p.price).toLocaleString()}</p>
          <a class="btn btn-sm btn-outline-primary" href="property.html?id=${p.id}">View</a>
        </div>
      </div>
    `).join('');
    container.innerHTML = html;
  }

  // On property.html load, show details by id
  if (document.getElementById("propertyWrap")) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const p = (window.__BB_SAMPLE || []).find(x => x.id === id) || null;
    const wrap = document.getElementById("propertyWrap");
    if (!p) { wrap.innerHTML = "<p>Property not found</p>"; return; }
    wrap.innerHTML = `
      <div class="row g-4">
        <div class="col-md-8">
          <img src="${p.img}" class="img-fluid rounded mb-3">
          <h3>${p.title}</h3>
          <p class="muted">${p.location}, ${p.city}</p>
          <h4 class="price">₹${Number(p.price).toLocaleString()}</h4>
          <p>${p.desc}</p>
        </div>
        <aside class="col-md-4">
          <div class="form-card">
            <h5>Contact Seller</h5>
            <p>Email: help@baribaba.com</p>
            <p><a href="tel:+919000000000" class="btn btn-success">Call</a></p>
          </div>
        </aside>
      </div>
    `;
  }
});
