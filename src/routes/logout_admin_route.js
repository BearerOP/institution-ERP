const express = require('express');
const logout_router = express.Router();
const {AuthController} = require('../controllers/authController');

// Route for signing out using a GET request
logout_router.get('/signout', AuthController);

module.exports = logout_router;
