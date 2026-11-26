const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.get('/:id', userController.getProfile);
router.patch('/:id', requireAuth, userController.updateProfile);

module.exports = router;
