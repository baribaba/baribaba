document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const city = document.getElementById("city").value;
      const location = document.getElementById("searchInput").value;

      // Redirect to search.html with query parameters
      window.location.href = `search.html?city=${encodeURIComponent(city)}&location=${encodeURIComponent(location)}`;
    });
  }

  // If we are on search.html, fetch and display results
  if (window.location.pathname.includes("search.html")) {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const location = params.get("location");

    fetchProperties(city, location);
  }
});

function fetchProperties(city, location) {
  fetch(`http://localhost:5000/api/properties/search?city=${encodeURIComponent(city)}&location=${encodeURIComponent(location)}`)
    .then(res => res.json())
    .then(data => {
      displayResults(data);
    })
    .catch(err => {
      console.error("Error fetching properties:", err);
    });
}

function displayResults(properties) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (properties.length === 0) {
    resultsContainer.innerHTML = "<p>No properties found.</p>";
    return;
  }

  properties.forEach(prop => {
    const card = document.createElement("div");
    card.classList.add("property-card");

    card.innerHTML = `
      <img src="${prop.main_image || 'images/default.jpg'}" alt="${prop.title}">
      <div class="property-info">
        <h3>${prop.title}</h3>
        <p>${prop.location}, ${prop.city}</p>
        <p><strong>₹${prop.price}</strong></p>
        <p>${prop.bedrooms} BHK • ${prop.bathrooms} Bath • ${prop.area} sq ft</p>
        <a href="property.html?id=${prop.id}" class="btn-details">View Details</a>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}
