const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, applicationController.listApplications);
router.post('/', requireAuth, requireRole('freelancer'), applicationController.createApplication);
router.patch('/:id/status', requireAuth, applicationController.updateApplicationStatus);

module.exports = router;
