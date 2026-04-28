const express = require('express');

const { sendMessage, getMessages } = require('../controllers/chatController');
const { getAllUsers } = require('../controllers/userController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/messages', sendMessage);
router.get('/messages', getMessages);
router.get('/users', requireAdmin, getAllUsers);

module.exports = router;
