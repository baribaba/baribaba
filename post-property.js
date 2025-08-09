document.getElementById("postPropertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const res = await fetch("http://localhost:5000/api/properties", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Property posted successfully!");
      window.location.href = "search.html?city=" + formData.get("city");
    } else {
      alert("❌ Error: " + data.message);
    }

  } catch (err) {
    console.error("Error posting property:", err);
    alert("❌ Something went wrong. Please try again.");
  }
});
