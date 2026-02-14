const db = require('../config/db');

exports.login = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });
        if (results.length > 0) res.json({ success: true });
        else res.json({ success: false });
    });
};

exports.signup = (req, res) => {
    const { username, password } = req.body;

    const checkSql = 'SELECT * FROM users WHERE name = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });

        if (results.length > 0) {
            return res.json({ success: false, error: 'Username exists' });
        }
        const insertSql = 'INSERT INTO users (name, password) VALUES (?, ?)';
        db.query(insertSql, [username, password], (err, insertResults) => {
            if (err) return res.status(500).json({ success: false, error: err });
            res.json({ success: true, user_id: insertResults.insertId });
        });
    });
};
