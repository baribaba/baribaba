function searchProperty() {
    let query = document.getElementById("searchBox").value.toLowerCase();
    let properties = document.querySelectorAll(".property-card");
    properties.forEach(card => {
        let title = card.querySelector("h2").innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
