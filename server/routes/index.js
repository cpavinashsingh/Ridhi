const express = require('express');

const { getHealth } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.get('/protected', protect, (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Protected route accessed successfully',
		user: req.user
	});
});

module.exports = router;
