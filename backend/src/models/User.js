const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    location_city: String,
    location_state: String,
    country: String,
    degree: String,
    branch: String,
    specialization: String,
    university: String,
    graduation_year: Number,
    experience_years: { type: Number, default: 0 },
    current_company: String,
    current_salary: Number,
    expected_salary: Number,
    resume_url: String,
    linkedin_url: String,
    skills: [String],
    work_experiences: [{
        company_name: String,
        role: String,
        start_year: Number,
        end_year: String,
        description: String
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

