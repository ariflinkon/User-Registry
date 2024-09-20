const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// User routes
router.get('/users', userController.getUsers);
router.put('/users/status', userController.updateUserStatus);
router.delete('/users', userController.deleteUser);

module.exports = router;
