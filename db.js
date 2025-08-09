// server/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "baribaba.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite error:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite DB:", dbPath);
});

module.exports = db;
