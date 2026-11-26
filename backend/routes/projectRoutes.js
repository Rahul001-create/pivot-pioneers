const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', projectController.listProjects);
router.post('/', requireAuth, requireRole('client'), projectController.createProject);
router.patch('/:id', requireAuth, requireRole('client'), projectController.updateProject);
router.post('/:id/submit', requireAuth, requireRole('freelancer'), projectController.submitWork);
router.post('/:id/approve', requireAuth, requireRole('client'), projectController.approveWork);

module.exports = router;
