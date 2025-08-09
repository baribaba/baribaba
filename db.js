// server/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "baribaba.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("DB connect error:", err.message);
  console.log("Connected to SQLite DB:", dbPath);
});

module.exports = db;
