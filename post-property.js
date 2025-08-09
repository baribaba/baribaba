// client/js/post-property.js
document.getElementById("postForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const status = document.getElementById("postStatus");
  const fd = new FormData(this);

  // read token from localStorage (set by login)
  const token = localStorage.getItem("baribaba_token");
  if (!token) { status.textContent = "You must be logged in to post."; return; }

  try {
    const res = await fetch("/api/properties", {
      method: "POST",
      body: fd,
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    status.textContent = "Posted successfully!";
    // redirect to property page
    window.location.href = "/property.html?id=" + data.property.id;
  } catch (err) {
    status.textContent = "Error: " + err.message;
  }
});
