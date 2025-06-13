const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const DB_PATH = path.join(__dirname, '..', 'clinic_database.sqlite');

// Connect to SQLite database. 
// The database file will be created if it doesn't exist.
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Function to initialize database schema
function initializeDatabase() {
    db.serialize(() => {
        // Create appointments table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            service TEXT NOT NULL,
            doctor TEXT,
            preferred_date TEXT NOT NULL, 
            message TEXT,
            status TEXT DEFAULT 'Pending', -- e.g., Pending, Confirmed, Cancelled
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating appointments table', err.message);
            } else {
                console.log('Appointments table checked/created successfully.');
            }
        });

        // You could add other tables here if needed, e.g., doctors, services
        // db.run(`CREATE TABLE IF NOT EXISTS doctors (...)`);
    });
}

// If this script is run directly (e.g., via `npm run init-db` or `node src/database.js`)
// ensure the database is initialized.
if (require.main === module) {
    console.log('Initializing database schema directly...');
    // The connection and initialization already happen when the module is loaded.
    // To ensure tables are created if the DB file was just made, we can re-call initialize
    // or simply rely on the initial call. For simplicity, the above connection logic suffices.
    // If the DB connection was deferred, we would explicitly call connect and initialize here.
    // db.close((err) => { // Optional: close if only running for init
    //     if (err) console.error('Error closing db', err.message);
    // });
}

module.exports = db;
