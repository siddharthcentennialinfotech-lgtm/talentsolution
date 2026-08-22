const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    getApplicationById,
    getAllCandidates,
    deleteApplication
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes — MUST come before /:id to avoid route collision
router.post('/', protect, applyToJob);
router.get('/my/all', protect, getMyApplications);

// Admin routes
router.get('/admin/candidates', protect, adminOnly, getAllCandidates);
router.get('/job/:jobId', protect, adminOnly, getJobApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);
router.delete('/:id', protect, adminOnly, deleteApplication);

// Generic by-ID route — must be LAST to avoid swallowing named routes
router.get('/:id', protect, getApplicationById);

module.exports = router;
