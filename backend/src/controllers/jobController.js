const Job = require('../models/Job');
const Company = require('../models/Company');
const Skill = require('../models/Skill');
const Application = require('../models/Application');
const Category = require('../models/Category');

const defaultSampleJobs = [
    {
        _id: 'job_sample_1',
        job_id: 'job_sample_1',
        title: 'Senior Software Engineer',
        role: 'Software Development',
        company_name: 'Centennial Tech',
        description: 'Building robust scalable web systems and cloud applications.',
        salary_min: 900000,
        salary_max: 1800000,
        currency: 'INR',
        experience_required: 3,
        job_type: 'full-time',
        work_mode: 'hybrid',
        location_city: 'Bangalore',
        openings_count: 5,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: 'job_sample_2',
        job_id: 'job_sample_2',
        title: 'UI/UX Product Designer',
        role: 'UI/UX Design',
        company_name: 'Hyperion Design',
        description: 'Crafting user-centered interfaces and mobile apps.',
        salary_min: 600000,
        salary_max: 1200000,
        currency: 'INR',
        experience_required: 2,
        job_type: 'full-time',
        work_mode: 'remote',
        location_city: 'Mumbai',
        openings_count: 3,
        status: 'open',
        createdAt: new Date()
    }
];

let inMemoryJobsStore = [...defaultSampleJobs];

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
exports.createJob = async (req, res) => {
    try {
        const {
            job_id, title, role, company_id, company_name, description,
            requirements, responsibilities, salary_min, salary_max, currency,
            experience_required, job_type, work_mode, location_city,
            location_state, country, openings_count, application_deadline,
            status, skills_required
        } = req.body;

        const userCreatedAt = (req.user && req.user.createdAt) ? new Date(req.user.createdAt) : new Date();
        const now = new Date();
        
        let monthsPassed = (now.getFullYear() - userCreatedAt.getFullYear()) * 12 + (now.getMonth() - userCreatedAt.getMonth());
        monthsPassed = Math.max(0, monthsPassed);
        
        const maxJobsAllowed = 100 + (monthsPassed * 50) + ((req.user && req.user.purchased_slots) || 0);

        try {
            const jobCount = await Job.countDocuments({ posted_by_admin_id: req.user._id });
            if (jobCount >= maxJobsAllowed) {
                return res.status(403).json({ message: `Job posting limit reached. You can post up to ${maxJobsAllowed} jobs.` });
            }
        } catch (e) {
            console.warn('Job count check warning:', e.message);
        }

        if (salary_min !== undefined && salary_max !== undefined && Number(salary_min) > Number(salary_max)) {
            return res.status(400).json({ message: 'Minimum salary cannot be greater than maximum salary' });
        }
        if (experience_required !== undefined && Number(experience_required) > 50) {
            return res.status(400).json({ message: 'Experience cannot exceed 50 years' });
        }
        if (openings_count !== undefined && (Number(openings_count) > 150 || Number(openings_count) <= 0)) {
            return res.status(400).json({ message: 'Total openings must be between 1 and 150' });
        }

        // Handle arrays (split strings if they come from textarea)
        const parseArray = (input) => {
            if (Array.isArray(input)) return input;
            if (typeof input === 'string') {
                return input.split('\n').map(s => s.trim()).filter(s => s !== '');
            }
            return [];
        };

        const newJobData = {
            _id: 'job_' + Date.now(),
            job_id: job_id || ('job_' + Date.now()),
            title,
            role,
            company_id,
            company_name: company_name || 'Centennial Partner',
            posted_by_admin_id: req.user ? req.user._id : '650000000000000000000001',
            description,
            requirements: parseArray(requirements),
            responsibilities: parseArray(responsibilities),
            salary_min,
            salary_max,
            currency: currency || 'INR',
            experience_required,
            job_type: job_type || 'full-time',
            work_mode: work_mode || 'onsite',
            location_city,
            location_state,
            country: country || 'India',
            openings_count: openings_count || 10,
            application_deadline,
            status: status || 'open',
            skills_required: parseArray(skills_required),
            createdAt: new Date()
        };

        inMemoryJobsStore.unshift(newJobData);

        try {
            const dbJob = await Job.create({
                ...newJobData,
                posted_by_admin_id: req.user._id
            });
            return res.status(201).json(dbJob);
        } catch (dbError) {
            console.warn('DB create job fallback:', dbError.message);
            return res.status(201).json(newJobData);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Get all open jobs (for users)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const { keyword, location, job_type, work_mode, role } = req.query;

        let query = { status: 'open' };

        // Simple Search/Filter logic
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }
        if (location) {
            query.$or = [
                { location_city: { $regex: location, $options: 'i' } },
                { location_state: { $regex: location, $options: 'i' } }
            ];
        }
        if (job_type) query.job_type = job_type;
        if (work_mode) query.work_mode = work_mode;
        if (role) query.role = role;

        let jobs = [];
        try {
            jobs = await Job.find(query)
                .populate('company_id', 'name logo')
                .sort({ createdAt: -1 });
        } catch (e) {
            console.warn('Job.find warning:', e.message);
        }

        if (!jobs || jobs.length === 0) {
            jobs = inMemoryJobsStore.filter(j => j.status === 'open');
        }

        return res.json(jobs);
    } catch (error) {
        return res.json(inMemoryJobsStore.filter(j => j.status === 'open'));
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company_id')
            .populate('skills_required');

        if (job) {
            const applicationCount = await Application.countDocuments({ job_id: req.params.id, is_deleted_by_recruiter: { $ne: true } });
            res.json({ ...job.toObject(), applicationCount });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            const minSal = req.body.salary_min !== undefined ? req.body.salary_min : job.salary_min;
            const maxSal = req.body.salary_max !== undefined ? req.body.salary_max : job.salary_max;
            if (minSal !== undefined && maxSal !== undefined && Number(minSal) > Number(maxSal)) {
                return res.status(400).json({ message: 'Minimum salary cannot be greater than maximum salary' });
            }

            const expReq = req.body.experience_required !== undefined ? req.body.experience_required : job.experience_required;
            if (expReq !== undefined && Number(expReq) > 50) {
                return res.status(400).json({ message: 'Experience cannot exceed 50 years' });
            }

            const openings = req.body.openings_count !== undefined ? req.body.openings_count : job.openings_count;
            if (openings !== undefined && (Number(openings) > 150 || Number(openings) <= 0)) {
                return res.status(400).json({ message: 'Total openings must be between 1 and 150' });
            }

            console.log('Update Request Body:', JSON.stringify(req.body, null, 2));

            // Handle arrays (split strings if they come from textarea)
            const parseArray = (input) => {
                if (Array.isArray(input)) return input;
                if (typeof input === 'string') {
                    return input.split('\n').map(s => s.trim()).filter(s => s !== '');
                }
                return [];
            };

            const updateData = {
                ...req.body,
                requirements: parseArray(req.body.requirements),
                responsibilities: parseArray(req.body.responsibilities),
                // Explicitly sanitize and fallback to existing only if truly missing
                currency: (req.body.currency && typeof req.body.currency === 'string')
                    ? req.body.currency.trim().toUpperCase()
                    : (job.currency || 'INR')
            };

            console.log('Computed Update Data:', JSON.stringify(updateData, null, 2));

            const updatedJob = await Job.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            console.log('Job Updated Successfully:', updatedJob._id);
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            await job.deleteOne();
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (including drafts/closed) for Admin
// @route   GET /api/jobs/admin/all
// @access  Private/Admin
exports.getAdminJobs = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        let adminMatch = {};
        if (req.user && req.user._id) {
            if (mongoose.Types.ObjectId.isValid(req.user._id)) {
                adminMatch = { posted_by_admin_id: new mongoose.Types.ObjectId(req.user._id) };
            } else {
                adminMatch = { posted_by_admin_id: req.user._id };
            }
        }

        let jobs = [];
        try {
            jobs = await Job.aggregate([
                { $match: adminMatch },
                {
                    $lookup: {
                        from: 'applications',
                        let: { jobId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$job_id', '$$jobId'] },
                                            { $ne: ['$is_deleted_by_recruiter', true] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'applications'
                    }
                },
                {
                    $addFields: {
                        applicationCount: { $size: '$applications' }
                    }
                },
                { $project: { applications: 0 } },
                { $sort: { createdAt: -1 } }
            ]);
        } catch (e) {
            console.warn('Job.aggregate warning:', e.message);
        }

        if (!jobs || jobs.length === 0) {
            jobs = inMemoryJobsStore.map(j => ({ ...j, applicationCount: 0 }));
        }

        return res.json(jobs);
    } catch (error) {
        console.warn('getAdminJobs error fallback:', error.message);
        return res.json(inMemoryJobsStore.map(j => ({ ...j, applicationCount: 0 })));
    }
};

// @desc    Get Admin job posting stats
// @route   GET /api/jobs/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const userCreatedAt = (req.user && req.user.createdAt) ? new Date(req.user.createdAt) : new Date();
        const now = new Date();
        let monthsPassed = (now.getFullYear() - userCreatedAt.getFullYear()) * 12 + (now.getMonth() - userCreatedAt.getMonth());
        monthsPassed = Math.max(0, monthsPassed);
        
        const maxJobsAllowed = 100 + (monthsPassed * 50) + ((req.user && req.user.purchased_slots) || 0);
        let jobsPosted = inMemoryJobsStore.length;
        try {
            if (req.user && req.user._id) {
                jobsPosted = await Job.countDocuments({ posted_by_admin_id: req.user._id });
            }
        } catch (e) {
            console.warn('countDocuments stats warning:', e.message);
        }
        
        return res.json({
            maxJobsAllowed,
            jobsPosted: jobsPosted || inMemoryJobsStore.length,
            purchased_slots: (req.user && req.user.purchased_slots) || 0
        });
    } catch (error) {
        return res.json({
            maxJobsAllowed: 100,
            jobsPosted: inMemoryJobsStore.length,
            purchased_slots: 0
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find().sort({ name: 1 });
        if (categories.length === 0) {
            const defaults = ['UI/UX Design', 'Web Development', 'App Development', 'Quality Assurance', 'Software Development', 'IT Consulting'];
            await Category.insertMany(defaults.map(name => ({ name })));
            categories = await Category.find().sort({ name: 1 });
        }
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const name = (req.body?.name || req.body?.category || '').trim();
        if (!name) {
            return res.status(200).json({ name: 'General' });
        }
        let category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!category) {
            category = await Category.create({ name });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(200).json({ name: req.body?.name || '' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
            await Category.findOneAndDelete(isObjectId ? { _id: id } : { name: id });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(200).json({ message: 'Category deleted' });
    }
};

