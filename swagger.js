const swaggerJsdoc = require('swagger-jsdoc');
const express = require('express');
const app = express();
const PORT = 3000;

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "My API Description",
        },
    },
    apis: ['./test.js'],
    paths: {
      '/api/data': {
        get: {
          summary: 'Fetch filtered data from Public APIs',
          description: 'Returns a list of public API entries based on provided filters.',
          parameters: [
            {
              in: 'query',
              name: 'category',
              description: 'Filter by API category',
              type: 'string',
            },
            {
              in: 'query',
              name: 'limit',
              description: 'Limit the number of results',
              type: 'integer',
            },
          ],
          responses: {
            200: {
              description: 'OK - List of filtered data entries',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/ApiEntry' // Define schema for ApiEntry object
                },
              },
            },
            400: {
              description: 'Bad Request - Invalid filter parameters',
            },
            404: {
              description: 'Not Found - No data found for the specified category',
            },
            500: {
              description: 'Internal Server Error',
            },
          },
        },
      },
    },
    definitions: {
      ApiEntry: {
        type: 'object',
        properties: {
          API: {
            type: 'string',
            description: 'API name',
          },
          Category: {
            type: 'string',
            description: 'API category',
          },
          // Add other properties of your data structure here
        },
      },
    },
  };
  

const specs = swaggerJsdoc(options);

module.exports = specs;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});