const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path
const dbPath = path.resolve(__dirname, "baribaba.db");

// Create and connect
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to BariBaba SQLite database.");
  }
});

module.exports = db;
