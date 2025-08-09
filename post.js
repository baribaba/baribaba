// js/post.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const obj = {
      title: fd.get('title'),
      type: fd.get('type'),
      price: Number(fd.get('price') || 0),
      city: fd.get('city'),
      location: fd.get('location'),
      description: fd.get('description') || ''
    };
    const file = fd.get('imageFile');

    // If Firebase configured, upload image to storage then save to Firestore
    if (window.fbStorage && window.fbDB) {
      try {
        const filename = `props/${Date.now()}-${file.name}`;
        const storageRef = fbStorage.ref().child(filename);
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        obj.image = url;
        const docRef = await fbDB.collection('properties').add(obj);
        document.getElementById('postStatus').textContent = 'Property posted (Firestore).';
        setTimeout(()=> window.location.href = `property.html?id=${docRef.id}`, 900);
      } catch (err) {
        alert('Upload error: ' + err.message);
      }
      return;
    }

    // Fallback: store in localStorage for demo
    let stored = JSON.parse(localStorage.getItem('bb_properties') || '[]');
    const newId = stored.length ? stored[stored.length-1].id + 1 : 100;
    obj.id = newId;
    obj.img = URL.createObjectURL(file);
    stored.push(obj);
    localStorage.setItem('bb_properties', JSON.stringify(stored));
    document.getElementById('postStatus').textContent = 'Posted locally (demo).';
    setTimeout(()=> window.location.href = `search.html?q=${encodeURIComponent(obj.title)}`, 900);
  });
});
