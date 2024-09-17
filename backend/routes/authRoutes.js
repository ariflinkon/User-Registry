const express = require('express');
const { register, login, getUsers, updateUserStatus, deleteUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.put('/users/status', updateUserStatus);
router.delete('/users', deleteUser);

module.exports = router;
