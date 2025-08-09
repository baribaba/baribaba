// server/initDB.js
const db = require("./db");

db.serialize(() => {
  // USERS
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // PROPERTIES
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    property_type TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area INTEGER,
    main_image TEXT,
    posted_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(posted_by) REFERENCES users(id)
  )`);

  // Clear and seed example properties
  db.run("DELETE FROM properties");

  const stmt = db.prepare(`INSERT INTO properties
    (title, description, price, location, city, property_type, bedrooms, bathrooms, area, main_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(
    "2BHK Flat in New Town",
    "Bright 2BHK near metro and mall.",
    4500000, "New Town", "Kolkata", "Buy", 2, 2, 980,
    "/images/prop1.jpg"
  );
  stmt.run(
    "3BHK in Rajarhat",
    "Spacious 3BHK near schools.",
    6500000, "Rajarhat", "Kolkata", "Buy", 3, 3, 1200,
    "/images/prop2.jpg"
  );
  stmt.run(
    "Furnished PG in Behala",
    "Well-maintained PG, meals included.",
    5500, "Behala", "Kolkata", "PG", 1, 1, 180,
    "/images/prop3.jpg"
  );
  stmt.finalize(() => {
    console.log("Seeded sample properties.");
    process.exit(0);
  });
});
