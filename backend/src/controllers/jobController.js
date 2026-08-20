const Job = require('../models/Job');
const Company = require('../models/Company');
const Skill = require('../models/Skill');
const Application = require('../models/Application');
const Category = require('../models/Category');

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

        const userCreatedAt = req.user.createdAt ? new Date(req.user.createdAt) : new Date();
        const now = new Date();
        
        let monthsPassed = (now.getFullYear() - userCreatedAt.getFullYear()) * 12 + (now.getMonth() - userCreatedAt.getMonth());
        if (now.getDate() < userCreatedAt.getDate()) {
            monthsPassed--;
        }
        monthsPassed = Math.max(0, monthsPassed);
        
        const maxJobsAllowed = 3 + (monthsPassed * 3) + (req.user.purchased_slots || 0);

        const jobCount = await Job.countDocuments({ posted_by_admin_id: req.user._id });
        if (jobCount >= maxJobsAllowed) {
            return res.status(403).json({ message: `Job posting limit reached. You can only post up to ${maxJobsAllowed} jobs based on your account age.` });
        }

        // Handle arrays (split strings if they come from textarea)
        const parseArray = (input) => {
            if (Array.isArray(input)) return input;
            if (typeof input === 'string') {
                return input.split('\n').map(s => s.trim()).filter(s => s !== '');
            }
            return [];
        };

        const job = await Job.create({
            job_id,
            title,
            role,
            company_id,
            company_name,
            posted_by_admin_id: req.user._id, // From auth middleware
            description,
            requirements: parseArray(requirements),
            responsibilities: parseArray(responsibilities),
            salary_min,
            salary_max,
            currency,
            experience_required,
            job_type,
            work_mode,
            location_city,
            location_state,
            country,
            openings_count,
            application_deadline,
            status: status || 'draft',
            skills_required
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        const jobs = await Job.find(query)
            .populate('company_id', 'name logo')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            const applicationCount = await Application.countDocuments({ job_id: req.params.id });
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
        const jobs = await Job.aggregate([
            { $match: { posted_by_admin_id: new mongoose.Types.ObjectId(req.user._id) } },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job_id',
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
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin job posting stats
// @route   GET /api/jobs/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const userCreatedAt = req.user.createdAt ? new Date(req.user.createdAt) : new Date();
        const now = new Date();
        let monthsPassed = (now.getFullYear() - userCreatedAt.getFullYear()) * 12 + (now.getMonth() - userCreatedAt.getMonth());
        if (now.getDate() < userCreatedAt.getDate()) {
            monthsPassed--;
        }
        monthsPassed = Math.max(0, monthsPassed);
        
        const maxJobsAllowed = 3 + (monthsPassed * 3) + (req.user.purchased_slots || 0);
        const jobsPosted = await Job.countDocuments({ posted_by_admin_id: req.user._id });
        
        res.json({
            maxJobsAllowed,
            jobsPosted,
            purchased_slots: req.user.purchased_slots || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const trimmed = name.trim();
        let category = await Category.findOne({ name: { $regex: new RegExp(`^${trimmed}$`, 'i') } });
        if (!category) {
            category = await Category.create({ name: trimmed });
        }
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
            await Category.findOneAndDelete(isObjectId ? { _id: id } : { name: id });
        }
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

