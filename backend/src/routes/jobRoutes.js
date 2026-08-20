const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getAdminJobs,
    getAdminStats,
    getCategories,
    addCategory,
    deleteCategory
} = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/categories/all', getCategories);
router.post('/categories/add', protect, adminOnly, addCategory);
router.delete('/categories/:id', protect, adminOnly, deleteCategory);

router.get('/admin/all', protect, adminOnly, getAdminJobs);
router.get('/admin/stats', protect, adminOnly, getAdminStats);

router.get('/:id', getJobById);

router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;
