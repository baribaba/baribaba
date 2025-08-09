document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id");

  if (!propertyId) {
    document.getElementById("property-container").innerHTML = "<p>Property not found.</p>";
    return;
  }

  fetch(`http://localhost:5000/api/properties/${propertyId}`)
    .then(res => res.json())
    .then(property => {
      displayProperty(property);
    })
    .catch(err => {
      console.error("Error fetching property:", err);
      document.getElementById("property-container").innerHTML = "<p>Error loading property details.</p>";
    });
});

function displayProperty(prop) {
  const container = document.getElementById("property-container");

  container.innerHTML = `
    <div class="property-gallery">
      <img src="${prop.main_image || 'images/default.jpg'}" alt="${prop.title}">
    </div>
    <div class="property-info">
      <h1>${prop.title}</h1>
      <p class="location">${prop.location}, ${prop.city}</p>
      <p class="price">₹${prop.price}</p>
      <p class="details">${prop.bedrooms} BHK • ${prop.bathrooms} Bath • ${prop.area} sq ft</p>
      <p class="description">${prop.description || 'No description available.'}</p>
      <h3>Contact</h3>
      <p>Owner: ${prop.owner_name || 'Not available'}</p>
      <p>Phone: ${prop.owner_phone || 'Not available'}</p>
      <a href="tel:${prop.owner_phone}" class="btn-contact">Call Owner</a>
    </div>
  `;
}
