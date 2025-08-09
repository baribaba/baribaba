// server/migrateAddMainImage.js
const db = require("./db");

db.run("ALTER TABLE properties ADD COLUMN main_image TEXT", function (err) {
  if (err) {
    if (err.message.includes("duplicate column")) {
      console.log("main_image column already exists.");
    } else {
      console.error("Error adding column:", err.message);
    }
  } else {
    console.log("Added main_image column to properties table.");
  }
  process.exit(0);
});
