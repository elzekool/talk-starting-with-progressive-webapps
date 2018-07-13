/**
 * Todo Module
 *
 * Module responsible for Todo API
 *
 * @author Elze Kool <efrkool@live.nl>
 */

'use strict';

module.exports = (app, db) => {

    // Create Todo table and fill it with some random data
    db.serialize(() => {
        db.run("CREATE TABLE todo (id INTEGER PRIMARY KEY ASC, done INTEGER, text TEXT)");
        const addTodoStm = db.prepare('INSERT INTO todo (done,text) VALUES (?,?)');
        for (let i = 1; i <= 10; i++) {
            addTodoStm.run((Math.random() > 0.5), `Example Todo #${i}`);
        }
        addTodoStm.finalize();
    });

    // Retrieve list of todo's
    app.get('/todos', (req, res) => {
        db.all('SELECT id, done, text FROM todo', (err, rows) => {
            res.status(200).json(rows.map((row) => {
                return { ...row, done : (row.done === 1) };
            }));
        });
    });

    // Get specific Todo by ID
    app.get('/todo/:id', (req, res) => {
        db.get('SELECT id, done, text FROM todo WHERE id = ?', req.params.id, (err, row) => {
            if (row === void 0) {
                res.status(404).json({ message: 'Todo item not found'});
                return;
            }
            res.status(200).json({ ...row, done : (row.done === 1) });
        });
    });

    // Delete specific Todo by ID
    app.delete('/todo/:id', (req, res) => {
        db.run('DELETE FROM todo WHERE id = ?', req.params.id, function(err) {
            /* Note: cannot use arrow function due to scope (uses this.changes) */
            if (this.changes === 0) {
                res.status(404).json({ message: 'Todo item not found'});
            } else {
                res.status(200).json({ message: 'Todo item deleted'});
            }
        });
    });

    // Update specific Todo by ID
    app.post('/todo/:id', (req, res) => {
        if (typeof req.body !== 'object') {
            res.status(400).json({ message: 'Bad request' });
        }

        db.get('SELECT id, done, text FROM todo WHERE id = ?', req.params.id, (err, row) => {
            if (row === void 0) {
                res.status(404).json({ message: 'Todo item not found'});
                return;
            }

            const todo = {
                id: row.id,
                done: (req.body.done !== void 0) ? req.body.done : (row.done === 1),
                text: (req.body.text !== void 0) ? req.body.text+'' : row.text
            };

            db.run('UPDATE todo SET done = ?, text = ? WHERE id = ?', todo.done ? 1 : 0, todo.text, todo.id, (err) => {
                res.status(200).json(todo);
            });
        });
    });

    // Create new Todo
    app.post('/todo', (req, res) => {
        if (typeof req.body !== 'object' || req.body.done === void 0 || req.body.text === void 0) {
            res.status(400).json({ message: 'Bad request' });
        }

        db.run('INSERT INTO todo (done,text) VALUES (?,?)', req.body.done ? 1 : 0, req.body.text+'', function(err) {
            /* Note: cannot use arrow function due to scope (uses this.changes) */
            if (this.changes === 0) {
                res.status(500).json({ message: 'Error creating todo'});
            } else {
                res.status(200).json({
                    id: this.lastID,
                    done: req.body.done,
                    text: req.body.text+''
                });
            }
        });
    });
};