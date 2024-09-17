const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.query(query, [name, email, hashedPassword], (err, result) => {
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
      res.json({ token, user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
};

const getUsers = (req, res) => {
  const query = `SELECT id, name, email, last_login_time, registration_time, status FROM users`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

const updateUserStatus = (req, res) => {
  const { userIds, status } = req.body;
  const query = `UPDATE users SET status = ? WHERE id IN (?)`;
  db.query(query, [status, userIds], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Users ${status}` });
  });
};

const deleteUser = (req, res) => {
  const { userIds } = req.body;
  const query = `DELETE FROM users WHERE id IN (?)`;
  db.query(query, [userIds], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Users deleted' });
  });
};

module.exports = { register, login, getUsers, updateUserStatus, deleteUser };
