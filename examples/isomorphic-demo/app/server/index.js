/**
 * Server Entry Point
 *
 * This is the entry point for the server. It imports the Express App and
 * starts listening.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import app from './app';
const port = process.env.port || 8080;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});