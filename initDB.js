// server/initDB.js
const db = require("./db");

db.serialize(() => {
  // Create properties table
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Clear sample (optional)
  db.run("DELETE FROM properties");

  // Insert sample properties (main_image points to files in client/images)
  const stmt = db.prepare(`INSERT INTO properties
    (title, description, price, location, city, property_type, bedrooms, bathrooms, area, main_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(
    "2 BHK Flat in New Town",
    "Bright 2 BHK with balcony near metro and market.",
    4500000, "New Town", "Kolkata", "Flat", 2, 2, 980, "/images/kolkata-flat-1.jpg"
  );

  stmt.run(
    "3 BHK Flat in Rajarhat",
    "Spacious 3 BHK, gated community.",
    6000000, "Rajarhat", "Kolkata", "Flat", 3, 3, 1250, "/images/kolkata-flat-2.jpg"
  );

  stmt.run(
    "Plot 500 sq yd in Dwarka",
    "Prime plot in Dwarka, perfect for builders.",
    12000000, "Dwarka", "Delhi", "Plot", null, null, 4500, "/images/delhi-flat-1.jpg"
  );

  stmt.run(
    "1 BHK PG in Behala",
    "Furnished PG, food available, close to bus stop.",
    5000, "Behala", "Kolkata", "PG", 1, 1, 180, "/images/kolkata-flat-1.jpg"
  );

  stmt.finalize(() => {
    console.log("DB initialized and seeded.");
    process.exit(0);
  });
});
