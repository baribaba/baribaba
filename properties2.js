// server/routes/properties.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer config (store files in /server/uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + Math.round(Math.random() * 1E9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// ---------- Helpers ----------
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function runInsert(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

// ---------- Routes ----------

// GET /api/properties  -> list all (with optional pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const offset = (page - 1) * perPage;

    const rows = await runQuery("SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?", [perPage, offset]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/properties/search?city=&location=&type=&minPrice=&maxPrice=&bhk=
router.get("/search", async (req, res) => {
  try {
    const { city, location, type, minPrice, maxPrice, bhk, page = 1, perPage = 20, sort } = req.query;
    let query = "SELECT p.*, pi.image_url AS main_image FROM properties p LEFT JOIN property_images pi ON pi.property_id = p.id AND pi.id = (SELECT id FROM property_images WHERE property_id = p.id ORDER BY id LIMIT 1) WHERE 1=1";
    const params = [];

    if (city) { query += " AND p.city = ?"; params.push(city); }
    if (location) { query += " AND p.location LIKE ?"; params.push(`%${location}%`); }
    if (type) { query += " AND p.property_type = ?"; params.push(type); }
    if (minPrice) { query += " AND p.price >= ?"; params.push(minPrice); }
    if (maxPrice) { query += " AND p.price <= ?"; params.push(maxPrice); }
    if (bhk) { query += " AND p.bedrooms = ?"; params.push(bhk); }

    // sorting
    if (sort === "price_asc") query += " ORDER BY p.price ASC";
    else if (sort === "price_desc") query += " ORDER BY p.price DESC";
    else query += " ORDER BY p.created_at DESC";

    // pagination
    const offset = (parseInt(page) - 1) * parseInt(perPage);
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(perPage), offset);

    const rows = await runQuery(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/properties/:id  -> property detail (with images)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const prop = await getQuery("SELECT * FROM properties WHERE id = ?", [id]);
    if (!prop) return res.status(404).json({ error: "Property not found" });

    const images = await runQuery("SELECT * FROM property_images WHERE property_id = ?", [id]);
    prop.images = images;
    res.json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/properties  -> post property with images (multipart/form-data)
// fields: title, description, price, location, city, property_type, bedrooms, bathrooms, area, owner_name, owner_phone
router.post("/", upload.fields([{ name: "main_image", maxCount: 1 }, { name: "images", maxCount: 8 }]), async (req, res) => {
  try {
    const {
      title, description = "", price, location, city, property_type,
      bedrooms = null, bathrooms = null, area = null, owner_name = "", owner_phone = ""
    } = req.body;

    if (!title || !price || !location || !city || !property_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert property
    const propId = await runInsert(
      `INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, location, city, property_type, bedrooms, bathrooms, area, null]
    );

    // Save images (main_image first if present, then other images)
    const savedImages = [];
    if (req.files) {
      // main_image
      if (req.files.main_image && req.files.main_image.length) {
        const f = req.files.main_image[0];
        const url = `/uploads/${f.filename}`;
        await runInsert("INSERT INTO property_images (property_id, image_url) VALUES (?, ?)", [propId, url]);
        savedImages.push(url);
        // also update properties.main_image (migration may have added main_image column)
        try {
          await runInsert("UPDATE properties SET main_image = ? WHERE id = ?", [url, propId]);
        } catch (e) {
          // If UPDATE can't be used with runInsert (because it returns lastID) use db.run directly:
          db.run("UPDATE properties SET main_image = ? WHERE id = ?", [url, propId], (err) => { /* ignore */ });
        }
      }

      // images[]
      if (req.files.images && req.files.images.length) {
        for (const f of req.files.images) {
          const url = `/uploads/${f.filename}`;
          await runInsert("INSERT INTO property_images (property_id, image_url) VALUES (?, ?)", [propId, url]);
          savedImages.push(url);
        }
      }
    }

    res.json({ message: "Property posted", property_id: propId, images: savedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
