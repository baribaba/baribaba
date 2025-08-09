// server/routes/properties.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure uploads dir
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  }
});
const upload = multer({ storage });

// helpers
const runAll = (sql, params = []) => new Promise((res, rej) =>
  db.all(sql, params, (err, rows) => err ? rej(err) : res(rows))
);
const runGet = (sql, params = []) => new Promise((res, rej) =>
  db.get(sql, params, (err, row) => err ? rej(err) : res(row))
);
const runInsert = (sql, params = []) => new Promise((res, rej) =>
  db.run(sql, params, function(err) { err ? rej(err) : res(this.lastID); })
);

// GET /api/properties — list (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const offset = (page - 1) * perPage;
    const rows = await runAll("SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?", [perPage, offset]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/properties/search?city=&q=&type=&minPrice=&maxPrice=&bedrooms=
router.get("/search", async (req, res) => {
  try {
    const { city, q, type, minPrice, maxPrice, bedrooms, page = 1, perPage = 50, sort } = req.query;
    let query = "SELECT * FROM properties WHERE 1=1";
    const params = [];

    if (city) { query += " AND city = ?"; params.push(city); }
    if (q) { query += " AND (title LIKE ? OR location LIKE ? OR description LIKE ?)"; params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
    if (type) { query += " AND property_type = ?"; params.push(type); }
    if (minPrice) { query += " AND price >= ?"; params.push(minPrice); }
    if (maxPrice) { query += " AND price <= ?"; params.push(maxPrice); }
    if (bedrooms) { query += " AND bedrooms = ?"; params.push(bedrooms); }

    if (sort === "price_asc") query += " ORDER BY price ASC";
    else if (sort === "price_desc") query += " ORDER BY price DESC";
    else query += " ORDER BY created_at DESC";

    const offset = (page - 1) * perPage;
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(perPage), offset);

    const rows = await runAll(query, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const row = await runGet("SELECT * FROM properties WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/properties — multipart form; fields: title, price, city, location, property_type, bedrooms, bathrooms, area, description
router.post("/", upload.single("main_image"), async (req, res) => {
  try {
    const { title, description = "", price, city, location, property_type, bedrooms = null, bathrooms = null, area = null } = req.body;
    if (!title || !price || !city || !location || !property_type) return res.status(400).json({ error: "Missing fields" });

    let imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    const lastID = await runInsert(
      `INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area, main_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, location, city, property_type, bedrooms, bathrooms, area, imgPath]
    );

    const newRow = await runGet("SELECT * FROM properties WHERE id = ?", [lastID]);
    res.json({ message: "Property posted", property: newRow });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
