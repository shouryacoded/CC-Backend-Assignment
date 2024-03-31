const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const secretKey = process.env.JWT_SECRET; // Replace with your secret key

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Generate JWT token for authentication
const generateToken = (user) => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' });
};

// API endpoint to authenticate and get JWT token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Perform authentication, e.g., check username and password

    // For demonstration purposes, let's assume authentication is successful
    const user = { username: username };
    const token = generateToken(user);

    res.json({ token: token });
});

// Authenticated API endpoint to fetch data from the public API with filtering options
app.get('/api/data', authenticateToken, async (req, res) => {
    try {
        const { category, limit } = req.query;

        // Make a request to the public API
        const response = await axios.get('https://api.publicapis.org/entries');

        // Filter the data based on category and result limit
        let filteredData = response.data.entries;
        if (category) {
            filteredData = filteredData.filter(entry => entry.Category === category);
        }
        if (limit) {
            filteredData = filteredData.slice(0, limit);
        }

        res.json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling for invalid requests and edge cases
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
