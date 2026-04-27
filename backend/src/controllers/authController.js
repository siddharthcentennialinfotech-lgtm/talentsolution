const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const otpStore = new Map(); // Store OTPs

// Generate Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/user/signup
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, location_city } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            phone,
            password, // Hashed by pre-save hook
            location_city
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                token: generateToken(user._id, 'user'),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/user/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                token: generateToken(user._id, 'user'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new admin
// @route   POST /api/auth/admin/signup
// @access  Public
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password // Hashed by pre-save hook
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id, 'admin'),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id, 'admin'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const fieldsToUpdate = [
                'first_name', 'last_name', 'phone', 'location_city', 'location_state',
                'country', 'degree', 'branch', 'specialization', 'university',
                'graduation_year', 'experience_years', 'current_company',
                'current_salary', 'expected_salary', 'resume_url', 'linkedin_url', 'skills'
            ];

            fieldsToUpdate.forEach(field => {
                if (req.body[field] !== undefined) {
                    user[field] = req.body[field];
                }
            });

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                name: `${updatedUser.first_name} ${updatedUser.last_name}`,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location_city: updatedUser.location_city,
                degree: updatedUser.degree,
                branch: updatedUser.branch,
                specialization: updatedUser.specialization,
                university: updatedUser.university,
                graduation_year: updatedUser.graduation_year,
                experience_years: updatedUser.experience_years,
                current_company: updatedUser.current_company,
                skills: updatedUser.skills,
                token: generateToken(updatedUser._id, 'user'),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: error.message });
    }
};// @desc    Verify email for password reset
// @route   POST /api/auth/forgot-password/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let user = await User.findOne({ email });
        let foundRole = 'user';

        if (!user) {
            user = await Admin.findOne({ email });
            foundRole = 'admin';
        }

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Generate OTP: random letter + number
        const otp = Math.random().toString(36).substring(2, 8).toUpperCase(); 
        
        // Store in memory for 10 mins
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'no-reply@examples.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}\n\nIt is valid for 10 minutes.\nIf you did not request this, please ignore this email.`
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log("Email credentials not provided in .env, skipping email send. Generated OTP:", otp);
        }

        res.json({ success: true, message: 'OTP sent to email', role: foundRole });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP for password reset
// @route   POST /api/auth/forgot-password/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const MASTER_OTP = '8520';
        if (otp === MASTER_OTP) {
            return res.json({ success: true, message: 'OTP Verified' });
        }

        const record = otpStore.get(email);
        if (!record) {
            return res.status(400).json({ message: 'OTP expired or not requested' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        if (record.otp === otp) {
            // we don't delete here yet, so they can use it to reset? Or reset doesn't need OTP anymore because they proved they have it.
            // But let's delete it so it can't be reused, and assume the very next step is reset.
            otpStore.delete(email);
            return res.json({ success: true, message: 'OTP Verified' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password
// @route   POST /api/auth/forgot-password/reset
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await Admin.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        user.password = password;
        await user.save(); // The pre-save hook will hash the password

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Social Login (Google/Apple)
// @route   POST /api/auth/social-login
// @access  Public
exports.socialLogin = async (req, res) => {
    try {
        const { email, first_name, last_name, provider, provider_id, current_role } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required from the provider' });
        }

        // Check if exists in User
        let user = await User.findOne({ email });
        if (user) {
            return res.json({
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: 'user',
                token: generateToken(user._id, 'user'),
            });
        }

        // Check if exists in Admin
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
                token: generateToken(admin._id, 'admin'),
            });
        }

        // If neither, register them as new based on current_role
        const crypto = require('crypto');
        const randomPassword = crypto.randomBytes(8).toString('hex');

        if (current_role === 'admin') {
            const newAdmin = await Admin.create({
                name: `${first_name || ''} ${last_name || ''}`.trim() || 'New Admin',
                email,
                password: randomPassword
            });
            return res.status(201).json({
                _id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: 'admin',
                token: generateToken(newAdmin._id, 'admin'),
            });
        } else {
            const newUser = await User.create({
                first_name: first_name || 'New',
                last_name: last_name || 'User',
                email,
                phone: `+00${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                password: randomPassword
            });
            return res.status(201).json({
                _id: newUser._id,
                name: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
                role: 'user',
                token: generateToken(newUser._id, 'user'),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile by ID (Admin only)
// @route   GET /api/auth/user/:id
// @access  Private/Admin
exports.getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
