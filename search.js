// Mock property data
const properties = [
  {
    city: "Kolkata",
    type: "Flat",
    price: 4500000,
    title: "2BHK in New Town",
    location: "New Town, Kolkata",
    img: "images/kolkata-flat-1.jpg",
    link: "property-details.html"
  },
  {
    city: "Delhi",
    type: "Plot",
    price: 12000000,
    title: "500 sq yd Plot in Dwarka",
    location: "Dwarka, Delhi",
    img: "images/delhi-flat-1.jpg",
    link: "property-details.html"
  },
  {
    city: "Mumbai",
    type: "Flat",
    price: 9500000,
    title: "3BHK in Bandra",
    location: "Bandra, Mumbai",
    img: "images/mumbai-plot-1.jpg",
    link: "property-details.html"
  }
];

function renderProperties(list) {
  const container = document.getElementById("propertyList");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>No properties found.</p>";
    return;
  }
  list.forEach(p => {
    container.innerHTML += `
      <div class="property-card">
        <img src="${p.img}" alt="${p.title}">
        <div class="details">
          <h3>${p.title}</h3>
          <p>${p.location}</p>
          <p class="price">₹${p.price.toLocaleString()}</p>
          <a href="${p.link}">View Details</a>
        </div>
      </div>
    `;
  });
}

function applyFilters() {
  const city = document.getElementById("city").value;
  const query = document.getElementById("searchInput").value.toLowerCase();
  const priceRange = document.getElementById("priceRange").value;
  const typeFilter = document.getElementById("typeFilter").value;

  let filtered = properties.filter(p => p.city === city);

  if (query) {
    filtered = filtered.filter(p => p.location.toLowerCase().includes(query) || p.title.toLowerCase().includes(query));
  }

  if (priceRange) {
    if (priceRange.includes("-")) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    } else {
      const min = Number(priceRange);
      filtered = filtered.filter(p => p.price >= min);
    }
  }

  if (typeFilter) {
    filtered = filtered.filter(p => p.type === typeFilter);
  }

  renderProperties(filtered);
}

document.getElementById("applyFilters").addEventListener("click", applyFilters);
document.getElementById("searchBtn").addEventListener("click", applyFilters);

// On load
applyFilters();
