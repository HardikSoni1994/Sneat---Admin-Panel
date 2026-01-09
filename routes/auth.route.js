const express = require('express');
const router = express.Router();

// Auth Controller import
const authController = require('../controllers/auth.controller');


// Login Routes
router.get('/', authController.loginPage);        // Login Page
router.post('/login', authController.loginAdmin); // Login Action

// Logout Routes
router.get('/logout', authController.logout);

// Register Routes
router.get('/register', authController.registerPage); 
router.post('/register', authController.registerUser);

// Forget Password Routes
router.get('/forget-password', authController.forgetPasswordPage);
router.post('/forget-password', authController.generateOtp);

// OTP Routes
router.get('/otp-verify', authController.otpPage);
router.post('/otp-verify', authController.verifyOtp);

module.exports = router;