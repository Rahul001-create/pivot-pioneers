const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

router.get('/conversations', requireAuth, messageController.listConversations);
router.post('/', requireAuth, messageController.sendMessage);

module.exports = router;
