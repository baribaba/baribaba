document.getElementById('searchBtn').addEventListener('click', function() {
    let city = document.getElementById('city').value;
    let query = document.getElementById('searchInput').value.trim();
    if(query){
        window.location.href = `search.html?city=${city}&q=${encodeURIComponent(query)}`;
    } else {
        alert("Please enter a search term!");
    }
});
