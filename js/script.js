document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.search-bar button');
  
  searchButton.addEventListener('click', () => {
    const location = document.querySelector('.search-bar select').value;
    const query = document.querySelector('.search-bar input').value.trim();
    if (query) {
      alert(`Searching for "${query}" in ${location}...`);
    } else {
      alert(`Please enter a search term for ${location}.`);
    }
  });
});
