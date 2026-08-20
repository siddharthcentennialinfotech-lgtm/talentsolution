const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    job_id: { type: String, required: true, unique: true }, // unique public ID like JOB1024
    title: { type: String, required: true },
    role: { type: String, required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    company_name: String, // fallback if not using company model
    company_logo: String,
    posted_by_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    salary_min: Number,
    salary_max: Number,
    currency: {
        type: String,
        enum: ['USD', 'INR'],
        default: 'INR',
        required: true
    },
    experience_required: Number,
    job_type: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        required: true
    },
    work_mode: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        required: true
    },
    location_city: String,
    location_state: String,
    country: String,
    openings_count: { type: Number, default: 1 },
    application_deadline: Date,
    status: {
        type: String,
        enum: ['open', 'closed', 'draft'],
        default: 'draft'
    },
    skills_required: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
