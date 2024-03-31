const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express'); // Import for Swagger UI
const swaggerJsdoc = require('swagger-jsdoc'); // Path to your swagger.js file

const app = express();
const PORT = 3000;

// Swagger setup
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Public API Interface',
        version: '1.0.0',
        description: 'A simple Express API',
      },
    },
    apis: ['./app.js'], // files containing annotations as above
  };
  
  const swaggerSpec = swaggerJsDoc(swaggerOptions);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  /**
   * @swagger
   * /api/data:
   *   get:
   *     description: Retrieve data from the public API with filtering options
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: The category to filter by
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: The number of results to retrieve
   *     responses:
   *       200:
   *         description: Successful retrieval of data
   *       400:
   *         description: Invalid request parameters
   *       404:
   *         description: No data found for the specified category
   *       500:
   *         description: Internal Server Error
   */

// API endpoint to fetch data from the public API with filtering options
app.get('/api/data', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Error handling for invalid requests and edge cases
if (!category && !limit) {
    res.status(400).json({ error: 'Please provide at least one filter parameter' });
} else if (category && !filteredData.length) {
    res.status(404).json({ error: 'No data found for the specified category' });
} else if (limit && limit <= 0) {
    res.status(400).json({ error: 'Invalid limit value. Limit must be a positive integer' });
}


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
