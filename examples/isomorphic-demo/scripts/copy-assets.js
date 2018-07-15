'use strict';

const path = require('path');
const fs = require('fs-extra');

const fromFolder = path.join(__dirname, '../app/client/static');
const toFolder = path.join(__dirname, '../build/static');
const indexHtml = path.join(__dirname, '../app/client/static/index.html');

fs.copySync(fromFolder, toFolder, {
    dereference: true,
    filter: file => file !== indexHtml
});

