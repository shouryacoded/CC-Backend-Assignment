const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// API endpoint to fetch data from the public API with filtering options
app.get('/api/data', async (req, res) => {
    try {
        const { category, limit } = req.query;

        // Make a request to the public API
        const response = await axios.get('https://api.publicapis.org/entries');

        // Filter the data based on category and result limit
        let filteredData = response.data.entries;
        if (!category && !limit) {
            res.status(400).json({ error: 'Please provide at least one filter parameter' });
        } else if (category && !filteredData.length) {
            res.status(404).json({ error: 'No data found for the specified category' });
        } else if (limit && limit <= 0) {
            res.status(400).json({ error: 'Invalid limit value. Limit must be a positive integer' });
        }
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});