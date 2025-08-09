// server/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads and client (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/client", express.static(path.join(__dirname, "..", "client"))); // optional static client folder

// Routes
const propertyRoutes = require("./routes/properties");
app.use("/api/properties", propertyRoutes);

// base route
app.get("/", (req, res) => res.send("BariBaba API running"));

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
