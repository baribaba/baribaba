const express = require("express");
const router = express.Router();
const db = require("../db");

// 1️⃣ Get all properties
router.get("/", (req, res) => {
  db.all("SELECT * FROM properties", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 2️⃣ Search by city & location
router.get("/search", (req, res) => {
  const { city, location, type, minPrice, maxPrice } = req.query;

  let query = "SELECT * FROM properties WHERE 1=1";
  let params = [];

  if (city) {
    query += " AND city = ?";
    params.push(city);
  }
  if (location) {
    query += " AND location LIKE ?";
    params.push(`%${location}%`);
  }
  if (type) {
    query += " AND property_type = ?";
    params.push(type);
  }
  if (minPrice) {
    query += " AND price >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 3️⃣ Get property by ID
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM properties WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Get images for the property
    db.all("SELECT * FROM property_images WHERE property_id = ?", [req.params.id], (err, images) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      row.images = images;
      res.json(row);
    });
  });
});

// 4️⃣ Post new property
router.post("/", (req, res) => {
  const { title, description, price, location, city, property_type, bedrooms, bathrooms, area, posted_by } = req.body;

  if (!title || !price || !location || !city || !property_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area, posted_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, price, location, city, property_type, bedrooms, bathrooms, area, posted_by],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Property added", property_id: this.lastID });
    }
  );
});

module.exports = router;
