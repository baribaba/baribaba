// Baribaba Global JS
console.log("Baribaba website loaded");

// Homepage search button (safe check)
const searchBtn = document.querySelector('.search-btn');
const citySelect = document.querySelector('#citySelect'); // use ID

if (searchBtn && citySelect) {
  searchBtn.addEventListener('click', () => {
    const city = citySelect.value;

    if (!city || city === 'Select City') {
      alert('Please select a city first!');
    } else {
      window.location.href = `search.html?city=${city}`;
    }
  });
}
