const express = require('express');

const { sendOTP, verifyOTP, signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
