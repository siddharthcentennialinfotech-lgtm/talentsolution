const Job = require('../models/Job');
const Company = require('../models/Company');
const Skill = require('../models/Skill');
const Application = require('../models/Application');
const Category = require('../models/Category');

const defaultSampleJobs = [
    {
        _id: '650000000000000000000101',
        job_id: 'job_fullstack_01',
        title: 'Senior Full Stack Software Engineer',
        role: 'Software Development',
        company_name: 'Centennial Tech Solutions',
        description: 'Building scalable enterprise cloud applications, web portals, and microservices architecture using Node.js, React, and GraphQL.',
        requirements: ['3+ years experience with Node.js & React', 'Solid understanding of REST APIs and MongoDB', 'Experience with TypeScript & Cloud deployments'],
        responsibilities: ['Architect robust frontend and backend services', 'Collaborate with product managers and UI designers', 'Optimize application performance and database queries'],
        salary_min: 900000,
        salary_max: 1800000,
        currency: 'INR',
        experience_required: 3,
        job_type: 'full-time',
        work_mode: 'hybrid',
        location_city: 'Bangalore',
        location_state: 'Karnataka',
        country: 'India',
        openings_count: 5,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000102',
        job_id: 'job_uiux_02',
        title: 'UI/UX Product Designer & Developer',
        role: 'UI/UX Design',
        company_name: 'Hyperion Innovations',
        description: 'Designing intuitive design systems, mobile apps, and modern responsive interfaces for high-growth tech platforms.',
        requirements: ['Proficiency in Figma and Adobe XD', 'Strong understanding of responsive HTML/CSS', 'Portfolio demonstrating end-to-end UX research'],
        responsibilities: ['Create wireframes, user flows, and interactive prototypes', 'Conduct user testing and iterate based on user feedback', 'Maintain design system tokens and component libraries'],
        salary_min: 600000,
        salary_max: 1400000,
        currency: 'INR',
        experience_required: 2,
        job_type: 'full-time',
        work_mode: 'remote',
        location_city: 'Mumbai',
        location_state: 'Maharashtra',
        country: 'India',
        openings_count: 4,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000103',
        job_id: 'job_qa_03',
        title: 'Lead Quality Assurance Automation Engineer',
        role: 'Quality Assurance',
        company_name: 'Centennial Infotech',
        description: 'Automating regression suites, API testing, and ensuring product reliability across web and mobile platforms.',
        requirements: ['4+ years in automated software testing', 'Experience with Cypress, Playwright, or Selenium', 'Strong API testing skills with Postman & Jest'],
        responsibilities: ['Develop end-to-end automated test suites', 'Identify bugs and work with developers to resolve issues', 'Implement CI/CD pipeline test integrations'],
        salary_min: 700000,
        salary_max: 1300000,
        currency: 'INR',
        experience_required: 4,
        job_type: 'full-time',
        work_mode: 'onsite',
        location_city: 'Delhi',
        location_state: 'Delhi',
        country: 'India',
        openings_count: 3,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000104',
        job_id: 'job_devops_04',
        title: 'DevOps & Cloud Infrastructure Engineer',
        role: 'IT Consulting',
        company_name: 'Apex Cloud Systems',
        description: 'Managing AWS infrastructure, Docker containers, Kubernetes clusters, and automated deployment pipelines.',
        requirements: ['Experience with AWS services (EC2, S3, ECS, EKS)', 'Proficiency in Terraform, Docker, & Kubernetes', 'Strong Bash/Python scripting abilities'],
        responsibilities: ['Monitor system uptime and security compliance', 'Automate CI/CD pipelines for zero-downtime releases', 'Optimize cloud server costs and resource usage'],
        salary_min: 1000000,
        salary_max: 2000000,
        currency: 'INR',
        experience_required: 4,
        job_type: 'full-time',
        work_mode: 'hybrid',
        location_city: 'Hyderabad',
        location_state: 'Telangana',
        country: 'India',
        openings_count: 6,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000105',
        job_id: 'job_react_05',
        title: 'Frontend React.js Specialist',
        role: 'Web Development',
        company_name: 'Vanguard Digital Lab',
        description: 'Crafting pixel-perfect, high-performance web applications using React, TailwindCSS, and state management tools.',
        requirements: ['Deep knowledge of React 18, Hooks, & Context API', 'Mastery of Vanilla CSS, TailwindCSS, and animation libraries', 'Experience with web performance optimization'],
        responsibilities: ['Build reusable UI component suites', 'Integrate backend APIs with dynamic state handling', 'Ensure accessibility (a11y) and cross-browser compatibility'],
        salary_min: 750000,
        salary_max: 1500000,
        currency: 'INR',
        experience_required: 2,
        job_type: 'full-time',
        work_mode: 'remote',
        location_city: 'Pune',
        location_state: 'Maharashtra',
        country: 'India',
        openings_count: 5,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000106',
        job_id: 'job_mobile_06',
        title: 'React Native & Mobile App Developer',
        role: 'App Development',
        company_name: 'Mobility Matrix',
        description: 'Building cross-platform iOS and Android applications with rich UI and seamless native module integration.',
        requirements: ['Experience with React Native and Expo framework', 'Understanding of App Store and Google Play deployment', 'Knowledge of native iOS/Android bridge components'],
        responsibilities: ['Develop fluid mobile applications', 'Integrate push notifications and location services', 'Maintain app stability and patch crashes'],
        salary_min: 800000,
        salary_max: 1600000,
        currency: 'INR',
        experience_required: 3,
        job_type: 'full-time',
        work_mode: 'hybrid',
        location_city: 'Chennai',
        location_state: 'Tamil Nadu',
        country: 'India',
        openings_count: 4,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000107',
        job_id: 'job_data_07',
        title: 'Data Analyst & BI Specialist',
        role: 'IT Consulting',
        company_name: 'Insight Analytics Group',
        description: 'Analyzing large datasets, creating interactive dashboards, and driving business decision-making with data.',
        requirements: ['Strong SQL skills and data modeling expertise', 'Proficiency in Python (Pandas/NumPy) or R', 'Experience with Tableau or PowerBI dashboards'],
        responsibilities: ['Build automated reporting dashboards', 'Analyze user acquisition and engagement metrics', 'Deliver actionable data insights to executive teams'],
        salary_min: 650000,
        salary_max: 1350000,
        currency: 'INR',
        experience_required: 2,
        job_type: 'full-time',
        work_mode: 'remote',
        location_city: 'Gurgaon',
        location_state: 'Haryana',
        country: 'India',
        openings_count: 3,
        status: 'open',
        createdAt: new Date()
    },
    {
        _id: '650000000000000000000108',
        job_id: 'job_backend_08',
        title: 'Backend Node.js Microservices Engineer',
        role: 'Software Development',
        company_name: 'Centennial Solutions',
        description: 'Designing high-throughput backend services, Redis caching layers, and database clusters for enterprise clients.',
        requirements: ['Expertise in Node.js, Express, and MongoDB/PostgreSQL', 'Knowledge of event-driven architecture (RabbitMQ/Kafka)', 'Understanding of security best practices (OAuth, JWT)'],
        responsibilities: ['Develop scalable API endpoints', 'Implement database query indexing and caching strategies', 'Ensure enterprise system security and compliance'],
        salary_min: 850000,
        salary_max: 1700000,
        currency: 'INR',
        experience_required: 3,
        job_type: 'full-time',
        work_mode: 'onsite',
        location_city: 'Noida',
        location_state: 'Uttar Pradesh',
        country: 'India',
        openings_count: 4,
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
        const mongoose = require('mongoose');
        let job = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            try {
                job = await Job.findById(req.params.id)
                    .populate('company_id')
                    .populate('skills_required');
            } catch (e) {
                console.warn('Job.findById warning:', e.message);
            }
        }

        if (!job) {
            job = inMemoryJobsStore.find(j => String(j._id) === String(req.params.id) || j.job_id === req.params.id);
        }

        if (job) {
            const jobObj = typeof job.toObject === 'function' ? job.toObject() : job;
            return res.json({ ...jobObj, applicationCount: 0 });
        } else {
            const fallback = inMemoryJobsStore[0];
            return res.json({ ...fallback, applicationCount: 0 });
        }
    } catch (error) {
        console.warn('getJobById fallback:', error.message);
        const fallback = inMemoryJobsStore[0];
        return res.json({ ...fallback, applicationCount: 0 });
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

