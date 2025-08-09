// server/routes/properties.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

// uploads directory
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "img-" + Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET all (paginated)
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const offset = (page - 1) * perPage;
  db.all("SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?", [perPage, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// SEARCH
router.get("/search", (req, res) => {
  const { city, q, type, minPrice, maxPrice } = req.query;
  let query = "SELECT * FROM properties WHERE 1=1";
  const params = [];

  if (city) { query += " AND city = ?"; params.push(city); }
  if (type) { query += " AND property_type = ?"; params.push(type); }
  if (q) { query += " AND (title LIKE ? OR location LIKE ? OR description LIKE ?)"; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (minPrice) { query += " AND price >= ?"; params.push(minPrice); }
  if (maxPrice) { query += " AND price <= ?"; params.push(maxPrice); }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET detail
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM properties WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  });
});

// POST new property (auth required)
router.post("/", auth, upload.single("main_image"), (req, res) => {
  const { title, description = "", price, location, city, property_type, bedrooms = null, bathrooms = null, area = null } = req.body;
  if (!title || !price || !location || !city || !property_type) return res.status(400).json({ error: "Missing required fields" });

  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area, main_image, posted_by)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [title, description, price, location, city, property_type, bedrooms, bathrooms, area, imgPath, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM properties WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Property created", property: row });
    });
  });
});

module.exports = router;
