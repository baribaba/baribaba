function searchProperty() {
    let input = document.getElementById('search').value.toLowerCase();
    let properties = document.querySelectorAll('.property');

    properties.forEach(property => {
        let text = property.innerText.toLowerCase();
        property.style.display = text.includes(input) ? "" : "none";
    });
}

document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert("Your property has been posted!");
});
