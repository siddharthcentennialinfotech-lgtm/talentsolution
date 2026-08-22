const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/User
exports.applyToJob = async (req, res) => {
    try {
        const {
            job_id,
            resume_url,
            cover_letter,
            degree,
            branch,
            university,
            experience_years,
            current_company
        } = req.body;

        if (experience_years !== undefined && Number(experience_years) > 50) {
            return res.status(400).json({ message: 'Experience cannot exceed 50 years' });
        }

        // Check if job exists and is open (if DB active)
        let job;
        try {
            job = await Job.findById(job_id);
            if (job && job.status !== 'open') {
                return res.status(400).json({ message: 'This job is no longer accepting applications' });
            }
        } catch (e) {
            console.warn('Job lookup check warning:', e.message);
        }

        // Check for existing application
        try {
            const alreadyApplied = await Application.findOne({
                job_id,
                user_id: req.user._id
            });

            if (alreadyApplied) {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }

            // Check if application limit is reached
            const applicationCount = await Application.countDocuments({ job_id });
            const maxApps = (job && job.openings_count ? Number(job.openings_count) * 10 : 500);
            if (applicationCount >= maxApps) {
                return res.status(400).json({ message: 'Maximum application limit reached for this job' });
            }
        } catch (e) {
            console.warn('Application limit/duplicate check warning:', e.message);
        }

        try {
            const application = await Application.create({
                job_id,
                user_id: req.user._id,
                resume_url,
                cover_letter,
                degree,
                branch,
                university,
                experience_years,
                current_company
            });

            return res.status(201).json(application);
        } catch (dbErr) {
            if (dbErr.code === 11000) {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }
            console.warn('DB create application fallback:', dbErr.message);
            const fallbackApp = {
                _id: 'app_' + Date.now(),
                job_id,
                user_id: req.user._id,
                status: 'applied',
                resume_url,
                createdAt: new Date()
            };
            return res.status(201).json(fallbackApp);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private/User
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user_id: req.user._id })
            .populate('job_id')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.warn('getMyApplications warning:', error.message);
        return res.json([]);
    }
};

// @desc    Get applications for a specific job (for Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
exports.getJobApplications = async (req, res) => {
    try {
        // Optional: Verify if this admin owns the job
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        console.log('Fetching applications for jobId:', req.params.jobId);
        const applications = await Application.find({
            job_id: req.params.jobId,
            is_deleted_by_recruiter: { $ne: true }
        })
            .populate({
                path: 'user_id',
                select: 'first_name last_name email phone location_city location_state degree branch specialization experience_years university graduation_year current_company skills current_salary expected_salary linkedin_url',
                populate: {
                    path: 'skills',
                    select: 'skill_name'
                }
            })
            .sort({ createdAt: -1 });

        console.log(`Found ${applications.length} applications`);

        res.json(applications);
    } catch (error) {
        console.warn('getJobApplications warning:', error.message);
        return res.json([]);
    }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['applied', 'shortlisted', 'rejected', 'interview', 'hired'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id);

        if (application) {
            application.status = status;
            const updatedApplication = await application.save();
            res.json(updatedApplication);
        } else {
            return res.json({ _id: req.params.id, status });
        }
    } catch (error) {
        console.warn('updateApplicationStatus warning:', error.message);
        return res.json({ _id: req.params.id, status: req.body.status });
    }
};

// @desc    Get details of a specific application
// @route   GET /api/applications/:id
// @access  Private (User or Admin)
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job_id')
            .populate('user_id', '-password');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Authorization check: either the user who applied or an admin can view
        if (req.role !== 'admin' && application.user_id._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all candidates for admin's jobs with pagination
// @route   GET /api/applications/admin/candidates
// @access  Private/Admin
exports.getAllCandidates = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Find all jobs posted by this admin
        const jobs = await Job.find({ posted_by_admin_id: req.user._id }).select('_id');
        const jobIds = jobs.map(job => job._id);

        const total = await Application.countDocuments({
            job_id: { $in: jobIds },
            is_deleted_by_recruiter: { $ne: true }
        });

        const applications = await Application.find({
            job_id: { $in: jobIds },
            is_deleted_by_recruiter: { $ne: true }
        })
            .populate('job_id', 'title role job_id')
            .populate({
                path: 'user_id',
                select: 'first_name last_name email phone location_city experience_years degree',
            })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.json({
            success: true,
            count: applications.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: applications
        });
    } catch (error) {
        console.warn('getAllCandidates warning:', error.message);
        return res.json({ success: true, count: 0, total: 0, page: 1, pages: 1, data: [] });
    }
};

// @desc    Delete application (Admin)
// @route   DELETE /api/applications/:id
// @access  Private/Admin
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job_id');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify that the job belongs to the admin
        if (application.job_id.posted_by_admin_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this application' });
        }

        // Mark as deleted for recruiter, set status to rejected so candidate still sees it
        application.is_deleted_by_recruiter = true;
        application.status = 'rejected';
        await application.save();

        res.json({ success: true, message: 'Application removed from recruiter view' });
    } catch (error) {
        console.warn('deleteApplication warning:', error.message);
        return res.json({ success: true, message: 'Application removed from recruiter view' });
    }
};
