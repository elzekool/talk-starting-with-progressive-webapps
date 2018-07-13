/**
 * Demo Backend for Talk "Starting with Progressive Web Apps
 *
 * This backend is used as a demo. The source code of this demo is not meant
 * as boilerplate code for your own project. The code is just enough for the
 * demo but doesn't adhere to any best practices.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

'use strict';

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const todoModule = require('./modules/todo');

// Initialize Express APP
const app = express();
app.use(express.json());

// Add swagger
app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(
        YAML.load('./swagger.yaml'),
        {
            swaggerOptions: {
                defaultModelsExpandDepth: -1
            }
        }
    )
);

// Create Memory SQLite3 DB
const db = new sqlite3.Database(':memory:');

// Create root endpoint
app.get('/', (req, res) => {
    res.status(200).json({message: 'Ready!'})
});

// Add modules
todoModule(app, db);

// Start Express
app.listen(
    5000, () => console.log('Example app listening on port 5000!')
);

