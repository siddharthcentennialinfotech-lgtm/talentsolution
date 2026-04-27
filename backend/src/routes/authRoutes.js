const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
    getUserProfileById,
    getProfile,
    updateProfile,
    verifyEmail,
    verifyOTP,
    resetPassword,
    socialLogin
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// User Routes
router.post('/user/signup', registerUser);
router.post('/user/login', loginUser);
router.get('/user/profile', protect, getProfile);
router.put('/user/profile', protect, updateProfile);

// Admin Routes
router.post('/admin/signup', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/user/:id', protect, getUserProfileById);

// Forgot Password Routes
router.post('/forgot-password/verify-email', verifyEmail);
router.post('/forgot-password/verify-otp', verifyOTP);
router.post('/forgot-password/reset', resetPassword);

// Social Auth Routes
router.post('/social-login', socialLogin);

module.exports = router;
