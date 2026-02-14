require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(express.json());

app.get('/users', (req, res) => {
    db.query('DESCRIBE user_groups_info ', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
