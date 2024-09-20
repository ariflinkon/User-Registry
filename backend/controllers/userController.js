// userController.js

const db = require('../config/db');

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

module.exports = { getUsers, updateUserStatus, deleteUser };
