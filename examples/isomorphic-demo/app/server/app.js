/**
 * Express App
 *
 * This is the ExpressJS app. It is responsible for hosting the
 * application (both client assets and rendering of the server side part)
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import path from 'path';
import express from 'express';
import renderer from './renderer';

const app = express();
const assets = express.static(path.join(__dirname, './static'));

app.use('/static', assets);
app.get('*', renderer);

export default app;