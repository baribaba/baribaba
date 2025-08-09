// server/index.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const propertiesRouter = require("./routes/properties");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve client static files
app.use("/", express.static(path.join(__dirname, "..", "client")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/properties", propertiesRouter);

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
