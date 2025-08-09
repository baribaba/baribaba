document.getElementById("searchBtn").addEventListener("click", function() {
  let city = document.getElementById("city").value;
  let query = document.getElementById("searchInput").value;
  window.location.href = `search.html?city=${city}&query=${encodeURIComponent(query)}`;
});
<script>
document.getElementById("searchBtn").addEventListener("click", function(){
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let typeFilter = document.getElementById("propertyType").value.toLowerCase();
    let priceFilter = document.getElementById("priceRange").value;

    let filtered = allProperties.filter(prop => {
        let matchesSearch = prop.location.toLowerCase().includes(searchValue) || 
                            prop.title.toLowerCase().includes(searchValue);
        let matchesType = typeFilter ? prop.type.toLowerCase() === typeFilter : true;
        
        let matchesPrice = true;
        if (priceFilter) {
            let [min, max] = priceFilter.split("-").map(Number);
            matchesPrice = prop.price >= min && prop.price <= max;
        }

        return matchesSearch && matchesType && matchesPrice;
    });

    displayProperties(filtered);
});
</script>
