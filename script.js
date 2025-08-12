let category = "buy";

function setCategory(cat) {
    category = cat;
    console.log("Category set to:", cat);
}

function searchProperty() {
    let query = document.getElementById("searchInput").value;
    if (query.trim() === "") {
        alert("Please enter a location or landmark");
        return;
    }
    window.location.href = `search.html?category=${category}&query=${encodeURIComponent(query)}`;
}

function quickSearch(location) {
    window.location.href = `search.html?category=${category}&query=${encodeURIComponent(location)}`;
}
