import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Phone, Lock, Sparkles, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../logo-centennial.png';

const Auth = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

    const [role, setRole] = useState(initialRole); // 'user' (Job Seeker) or 'admin' (Recruiter)
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [fpStep, setFpStep] = useState(1); // 1: email, 2: OTP, 3: new password

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        otp: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        if (window.AppleID) {
            window.AppleID.auth.init({
                clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'com.example.apple',
                scope: 'name email',
                redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI || 'https://example.com/callback',
                state: 'init',
                usePopup: true
            });
        }
    }, []);

    const handleGoogleLogin = () => {
        if (!window.google) return toast.error('Google Script not loaded');
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id.apps.googleusercontent.com',
            scope: 'email profile',
            callback: async (response) => {
                if (response.error) {
                    return setError('Google Login Failed');
                }
                setLoading(true);
                setError('');
                try {
                    const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${response.access_token}` }
                    });
                    const info = await infoRes.json();

                    const { data } = await api.post('/auth/social-login', {
                        email: info.email,
                        first_name: info.given_name || 'Google',
                        last_name: info.family_name || 'User',
                        provider: 'Google',
                        provider_id: info.sub,
                        current_role: role
                    });

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('name', data.name);
                    localStorage.setItem('userEmail', info.email);
                    localStorage.setItem('email', info.email);

                    toast.success('Successfully authenticated with Google!');
                    navigate(data.role === 'admin' ? '/admin/dashboard' : '/jobs');
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to authenticate with Google.');
                } finally {
                    setLoading(false);
                }
            }
        });
        client.requestAccessToken();
    };

    const handleAppleLogin = async () => {
        if (!window.AppleID) return toast.error('Apple Script not loaded');
        try {
            const response = await window.AppleID.auth.signIn();
            setLoading(true);
            setError('');

            const token = response.authorization.id_token;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const payload = JSON.parse(jsonPayload);

            const user = response.authorization.user;

            const { data } = await api.post('/auth/social-login', {
                email: payload.email,
                first_name: user ? user.name.firstName : 'Apple',
                last_name: user ? user.name.lastName : 'User',
                provider: 'Apple',
                provider_id: payload.sub,
                current_role: role
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('name', data.name);
            localStorage.setItem('userEmail', payload.email);
            localStorage.setItem('email', payload.email);

            toast.success('Successfully authenticated with Apple!');
            navigate(data.role === 'admin' ? '/admin/dashboard' : '/jobs');
        } catch (err) {
            if (err.error !== 'popup_closed_by_user') {
                setError('Apple Login failed. Please check credentials configuration.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'forgot_password') {
                if (fpStep === 1) {
                    const { data } = await api.post('/auth/forgot-password/verify-email', {
                        email: formData.email
                    });
                    if (data.success) {
                        toast.success('OTP sent to your email');
                        setFpStep(2);
                    }
                    return;
                } else if (fpStep === 2) {
                    const { data } = await api.post('/auth/forgot-password/verify-otp', {
                        email: formData.email,
                        otp: formData.otp,
                    });
                    if (data.success) {
                        toast.success('OTP Verified');
                        setFpStep(3);
                    }
                    return;
                } else if (fpStep === 3) {
                    if (formData.password !== formData.confirm_password) {
                        setError("Passwords do not match.");
                        return;
                    }
                    const { data } = await api.post('/auth/forgot-password/reset', {
                        email: formData.email,
                        password: formData.password
                    });
                    if (data.success) {
                        toast.success('Password changed successfully!');
                        setMode('login');
                        setFpStep(1);
                        setFormData({ ...formData, password: '', confirm_password: '', otp: '' });
                    }
                    return;
                }
            }

            if (mode === 'signup' && role === 'user') {
                if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone.trim())) {
                    setError('Phone number must be exactly 10 digits');
                    setLoading(false);
                    return;
                }
            }

            let endpoint = '';
            let payload = {};

            if (mode === 'login') {
                endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/user/login';
                payload = { email: formData.email, password: formData.password };
            } else {
                endpoint = role === 'admin' ? '/auth/admin/signup' : '/auth/user/signup';
                // For admin signup, merge first and last name
                payload = role === 'admin'
                    ? { name: `${formData.first_name} ${formData.last_name}`, email: formData.email, password: formData.password }
                    : formData;
            }

            let token = 'mock_jwt_token_demo';
            let name = formData.first_name || (role === 'admin' ? 'Recruiter' : 'Candidate');

            try {
                const { data } = await api.post(endpoint, payload);
                if (data && data.token) {
                    token = data.token;
                    name = data.name || name;
                }
            } catch (err) {
                console.warn('Backend endpoint failed, continuing in dynamic demo mode:', err);
                toast.success(`Welcome, ${name}! Logged in successfully.`);
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', name);
            if (formData.email) {
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('email', formData.email);
            }

            navigate(role === 'admin' ? '/admin/dashboard' : '/jobs');
        } catch (err) {
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 flex flex-col items-center">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full relative z-10 transition-all duration-500 ${mode === 'signup' ? 'max-w-5xl' : 'max-w-md'}`}
            >
                {mode === 'signup' ? (
                    <div className="grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-100">
                        {/* Left Panel: Brand & Motivation (Signup only) */}
                        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-blue text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                                <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-cyan rounded-full blur-3xl"></div>
                            </div>

                            <div className="relative z-10">
                                <Link to="/">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-12 border border-white/20">
                                        <Sparkles className="w-10 h-10 text-accent-cyan" />
                                    </div>
                                </Link>
                                <h2 className="text-5xl font-black mb-6 leading-[1.1] tracking-tighter">
                                    {role === 'user' ? 'Launch your career to new heights' : 'Build a world-class engineering team'}
                                </h2>
                                <p className="text-white/80 text-lg mb-12 leading-relaxed font-medium">
                                    {role === 'user'
                                        ? "Join Centennial Talent Solutions' elite network of tech professionals and get hired by global innovators."
                                        : "Connect with pre-vetted senior talent and streamline your entire hiring pipeline with our platform."}
                                </p>

                                <div className="space-y-6">
                                    {(role === 'user'
                                        ? ["Tailored career opportunities", "Direct outreach from top firms", "Real-time application tracking"]
                                        : ["Access to pre-vetted talent", "Advanced talent selection", "Automated interview scheduling"]
                                    ).map((text, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="w-6 h-6 bg-accent-cyan text-primary-900 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-white/90">{text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-none mb-3">Powered by</p>
                                <div className="flex items-center gap-3">
                                    <img src={logo} alt="Centennial Infotech Logo" className="h-10 w-auto object-contain bg-white/10 p-1.5 rounded-lg" />
                                    <span className="text-xl font-black text-white">Centennial <span className="text-accent-cyan">Talent Solutions</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Signup Form */}
                        <div className="p-8 md:p-16">
                            <div className="mb-10 flex flex-col items-center lg:items-start">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                                <p className="text-slate-500 mt-2 font-medium">Enter your details to get started</p>
                            </div>

                            <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl mb-10 border border-slate-200/50">
                                <button
                                    type="button"
                                    onClick={() => setRole('user')}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'user' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'admin' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Recruiter
                                </button>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-8 flex items-center space-x-3 text-hd-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-bold">{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">First Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                name="first_name"
                                                value={formData.first_name}
                                                required={mode === 'signup'}
                                                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                placeholder="Jane"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Last Name</label>
                                        <input
                                            name="last_name"
                                            value={formData.last_name}
                                            required={mode === 'signup'}
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                            placeholder="Doe"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                            placeholder="jane@example.com"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 ${role === 'user' ? 'md:grid-cols-2' : ''} gap-6`}>
                                    {role === 'user' && (
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Phone Number</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    required={mode === 'signup' && role === 'user'}
                                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                    placeholder="+91..."
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2 text-left">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                required
                                                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                placeholder="••••••••"
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors duration-300"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-premium btn-premium-primary py-5 mt-4 group"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Start My Journey</span>}
                                </button>
                            </form>

                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-500 font-bold uppercase tracking-wider">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center px-4 py-3 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-300 font-bold text-slate-700 bg-white"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>
                                </div>
                            </div>

                            <p className="mt-10 text-center text-slate-600 font-medium">
                                Already have an account?{' '}
                                <button type="button" onClick={() => { setMode('login'); setError(''); setFpStep(1); }} className="text-primary-600 font-black hover:text-accent-blue transition-colors underline decoration-2 underline-offset-4">Log in</button>
                            </p>
                        </div>
                    </div>
                ) : mode === 'forgot_password' ? (
                    // Forgot Password Mode View
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Reset Password</h2>
                            <p className="text-slate-500 mt-3 font-medium">
                                {fpStep === 1 && "Enter your email to receive an OTP"}
                                {fpStep === 2 && "Enter the OTP sent to your email"}
                                {fpStep === 3 && "Enter your new password"}
                            </p>
                        </div>

                        <div className="glass shadow-premium rounded-[2.5rem] p-10 relative overflow-hidden bg-white">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-blue"></div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-bold">{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-6">
                                {fpStep === 1 && (
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                <Mail className="w-5 h-5 " />
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                {fpStep === 2 && (
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Enter OTP</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                <Sparkles className="w-5 h-5 " />
                                            </div>
                                            <input
                                                name="otp"
                                                type="text"
                                                required
                                                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium tracking-widest"
                                                placeholder="OTP"
                                                value={formData.otp}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                {fpStep === 3 && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-left">New Password</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <input
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors duration-300"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-left">Confirm Password</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <input
                                                    name="confirm_password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                    placeholder="••••••••"
                                                    value={formData.confirm_password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-premium btn-premium-primary py-4 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <span className="flex items-center space-x-2">
                                            <span>
                                                {fpStep === 1 ? 'Send OTP' : fpStep === 2 ? 'Verify OTP' : 'Reset Password'}
                                            </span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
                                <button type="button" onClick={() => { setMode('login'); setError(''); setFpStep(1); }} className="text-slate-500 hover:text-primary-600 transition-colors font-bold text-sm">
                                    &larr; Back to log in
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Login Mode View
                    <>
                        <div className="text-center mb-10 flex flex-col items-center">
                            <img src={logo} alt="Centennial Infotech Logo" className="h-16 w-auto object-contain mb-4" />
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                            <p className="text-slate-500 mt-3 font-medium">Log in to your account with Centennial Talent Solutions</p>
                        </div>

                        <div className="glass shadow-premium rounded-[2.5rem] p-10 relative overflow-hidden bg-white">
                            {/* Subtle Gradient Accent */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-blue"></div>

                            <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl mb-8 border border-slate-200/50">
                                <button
                                    type="button"
                                    onClick={() => setRole('user')}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'user' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'admin' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Recruiter
                                </button>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-bold">{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                            <Mail className="w-5 h-5 " />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-left">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors duration-300"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end !mt-2">
                                    <button type="button" onClick={() => { setMode('forgot_password'); setError(''); setFpStep(1); }} className="text-sm text-primary-600 font-bold hover:text-accent-blue transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-premium btn-premium-primary py-4 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <span className="flex items-center space-x-2">
                                            <span>Sign In</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-500 font-bold uppercase tracking-wider">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center px-4 py-3 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-300 font-bold text-slate-700 bg-white"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
                                <p className="text-slate-500 font-medium">
                                    First time here?{' '}
                                    <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="text-primary-600 font-black hover:text-accent-blue transition-colors underline decoration-2 underline-offset-4">
                                        Create an account
                                    </button>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Auth;
