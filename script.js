// ===============================
// 🔴 Baribaba Global JavaScript
// ===============================

console.log("Baribaba website loaded");

// =====================================
// ✅ HOMEPAGE SEARCH BUTTON (SAFE)
// =====================================

const searchBtn = document.querySelector('.search-btn');
const citySelect = document.querySelector('#citySelect');

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

// =====================================
// ✅ FIND PROPERTY FILTER SYSTEM
// =====================================

function filterProperties() {

  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const locationFilter = document.getElementById("locationFilter");
  const budgetFilter = document.getElementById("budgetFilter");

  if (!searchInput) return; // prevent errors on other pages

  let search = searchInput.value.toLowerCase();
  let type = typeFilter.value;
  let category = categoryFilter.value;
  let location = locationFilter.value;
  let budget = budgetFilter.value;

  let cards = document.querySelectorAll(".property-card");

  cards.forEach(card => {

    let cardText = card.innerText.toLowerCase();
    let cardType = card.dataset.type;
    let cardCategory = card.dataset.category;
    let cardLocation = card.dataset.location;
    let cardPrice = parseInt(card.dataset.price);

    let show = true;

    if (search && !cardText.includes(search)) show = false;
    if (type && cardType !== type) show = false;
    if (category && cardCategory !== category) show = false;
    if (location && cardLocation !== location) show = false;
    if (budget && cardPrice > budget) show = false;

    card.style.display = show ? "block" : "none";

  });
}

// =====================================
// ✅ WHATSAPP DIRECT CONTACT
// =====================================

function whatsappContact(propertyName) {
  const phone = "918240473982";
  const message = `Hello Baribaba, I am interested in ${propertyName}. Please share more details.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// =====================================
// ✅ PROPERTY DETAILS POPUP SYSTEM
// =====================================

function openDetails(button) {

  const card = button.closest(".property-card");
  if (!card) return;

  const title = card.querySelector("h3")?.innerText || "";
  const location = card.dataset.location || "";
  const price = card.dataset.price || "";
  const description = card.querySelector("p:last-of-type")?.innerText || "";

  alert(
    `Property: ${title}\n\nLocation: ${location}\nPrice: ₹${price}\n\n${description}\n\nContact: 8240473982`
  );
}

// =====================================
// ✅ FAQ TOGGLE SYSTEM
// =====================================

document.addEventListener("DOMContentLoaded", function () {

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    }
  });

});

// =====================================
// ✅ AUTO SCROLL TESTIMONIAL SLIDER
// =====================================

const scrollContainer = document.querySelector(".scrolling-reviews");

if (scrollContainer) {

  let scrollAmount = 0;

  setInterval(() => {
    scrollAmount += 1;
    scrollContainer.scrollLeft = scrollAmount;

    if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
      scrollAmount = 0;
    }

  }, 20);
}

// =====================================
// ✅ SMOOTH SCROLL ANIMATION
// =====================================

document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
