document.getElementById("searchBtn").addEventListener("click", function() {
  let city = document.getElementById("city").value;
  let query = document.getElementById("searchInput").value;
  window.location.href = `search.html?city=${city}&query=${encodeURIComponent(query)}`;
});
