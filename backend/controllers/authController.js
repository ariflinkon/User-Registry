// authController.js

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Setting the current time as registration time
  const registrationTime = new Date();

  const query = `INSERT INTO users (name, email, password, registration_time) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, email, hashedPassword, registrationTime], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User registered' });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = result[0];
    if (bcrypt.compareSync(password, user.password)) {
      if (user.status === 'blocked') return res.status(403).json({ error: 'User is blocked' });

      const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });

      // Update last login time
      const lastLoginTime = new Date();
      const updateLoginTimeQuery = `UPDATE users SET last_login_time = ? WHERE id = ?`;
      db.query(updateLoginTimeQuery, [lastLoginTime, user.id], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });

        res.json({ token, user });
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
};

module.exports = { register, login };
