const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer to store files in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only PDF and doc files
        if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf, .doc and .docx format allowed!'), false);
        }
    }
});

const handleMulterUpload = (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'File upload error' });
        }
        next();
    });
};

// @route   POST /api/upload/resume
// @access  Private/User
router.post('/resume', protect, handleMulterUpload, uploadResume);

module.exports = router;
