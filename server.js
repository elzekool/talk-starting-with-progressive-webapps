'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, './'), {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'private, no-cache');
    }
}));

const port = process.env.port || 5040;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});