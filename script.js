// Basic JS interactions

console.log("Website Loaded Successfully");

// Future-ready structure for adding features

// Example: City Selection Alert
const searchBtn = document.querySelector('.search-btn');
const citySelect = document.querySelector('select');

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const city = citySelect.value;
    if (city === 'Select City') {
      alert('Please select a city first!');
    } else {
      alert(`Searching properties in ${city}...`);
    }
  });
}
