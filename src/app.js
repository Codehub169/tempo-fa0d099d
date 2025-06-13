const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const db = require('./database'); // Ensures database is initialized

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api', apiRoutes);

// Catch-all for HTML pages (optional, if you want Express to handle all routes)
// If you want direct file access (e.g. /services.html), express.static is enough.
// This is more for single-page applications or specific routing needs.
app.get('/:pageName', (req, res) => {
    const pageName = req.params.pageName;
    // Basic security: only allow alphanumeric page names
    if (!/^[a-zA-Z0-9_-]+\.html$/.test(pageName)) {
        return res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html')); // Assuming you have a 404.html
    }
    const filePath = path.join(__dirname, '..', 'public', pageName);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error sending file: ${pageName}`, err);
            // Send a generic 404 if a specific error or if file not found by sendFile
            // (though express.static usually handles this for existing files)
            if (!res.headersSent) {
                 // Check if 404.html exists, otherwise send plain text
                const notFoundPath = path.join(__dirname, '..', 'public', '404.html');
                require('fs').access(notFoundPath, require('fs').constants.F_OK, (errAccess) => {
                    if (errAccess) {
                        res.status(404).send('Page not found');
                    } else {
                        res.status(404).sendFile(notFoundPath);
                    }
                });
            }
        }
    });
});

// Home page route (if not covered by express.static index.html implicitly)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
