const express = require('express');
const router = express.Router();
const db = require('../database');

// API endpoint for booking an appointment
router.post('/appointments', (req, res) => {
    const { name, phone, email, service, doctor, date, message } = req.body;

    // Basic validation
    if (!name || !phone || !email || !service || !date) {
        return res.status(400).json({ error: 'Missing required fields: name, phone, email, service, and date are required.' });
    }

    const stmt = db.prepare(`INSERT INTO appointments (name, phone, email, service, doctor, preferred_date, message, status) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    stmt.run(name, phone, email, service, doctor || 'Any', date, message || '', 'Pending', function(err) {
        if (err) {
            console.error('Error inserting appointment:', err.message);
            return res.status(500).json({ error: 'Failed to book appointment. Please try again later.' });
        }
        res.status(201).json({ message: 'Appointment booked successfully!', appointmentId: this.lastID });
    });
    stmt.finalize();
});

// API endpoint to get all appointments (for potential admin use - secure appropriately in a real app)
router.get('/appointments', (req, res) => {
    db.all('SELECT * FROM appointments ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching appointments:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve appointments.' });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;
