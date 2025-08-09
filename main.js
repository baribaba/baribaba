// client/js/main.js
document.getElementById("homeSearch").addEventListener("click", function(){
  const city = document.getElementById("homeCity").value;
  const q = document.getElementById("homeQuery").value.trim();
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (q) params.set("q", q);
  window.location.href = "/search.html?" + params.toString();
});
