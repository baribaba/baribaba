// server/index.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve client static folder
app.use("/", express.static(path.join(__dirname, "..", "client")));

// serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
const authRoutes = require("./routes/auth");
const propertiesRoutes = require("./routes/properties");

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
