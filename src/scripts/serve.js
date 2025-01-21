const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Add headers to allow local development
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static files from the dist directory
app.use(express.static('dist'));

// Handle 404s by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log('Press Ctrl+C to stop');
}); 