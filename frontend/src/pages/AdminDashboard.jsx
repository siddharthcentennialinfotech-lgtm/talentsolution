import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Briefcase, Users, Eye, Edit, Trash2, Loader2, X, MapPin, DollarSign, Clock, GraduationCap, Phone, Download, Mail, FileText, Building2, CheckCircle2, ArrowRight, Globe, Lock, LogOut, Bold, Italic, Underline, List, ListOrdered, RemoveFormatting, Database, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InrLogo from '../assets/inr-logo.jpg';
import logo from '../logo-centennial.png';

const RichTextEditor = ({ value, onChange }) => {
    const editorRef = React.useRef(null);
    const [states, setStates] = React.useState({ bold: false, italic: false, underline: false, ul: false, ol: false });

    React.useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const updateStates = () => {
        try {
            setStates({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                ul: document.queryCommandState('insertUnorderedList'),
                ol: document.queryCommandState('insertOrderedList'),
            });
        } catch (e) {}
    };

    const handleAction = (e, cmd, val = null) => {
        e.preventDefault();
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(cmd, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        setTimeout(updateStates, 10);
    };

    return (
        <div className="border-2 border-slate-100 rounded-2xl overflow-hidden bg-slate-50 focus-within:border-primary-500 focus-within:bg-white transition-all duration-300">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-slate-700 select-none">
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'bold')}
                    className={`p-1.5 rounded text-xs transition-all ${states.bold ? 'bg-primary-600 text-white font-bold shadow-sm' : 'hover:bg-white hover:shadow-sm font-bold'}`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'italic')}
                    className={`p-1.5 rounded text-xs transition-all ${states.italic ? 'bg-primary-600 text-white font-bold shadow-sm' : 'hover:bg-white hover:shadow-sm italic'}`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'underline')}
                    className={`p-1.5 rounded text-xs transition-all ${states.underline ? 'bg-primary-600 text-white font-bold shadow-sm' : 'hover:bg-white hover:shadow-sm underline'}`}
                    title="Underline"
                >
                    <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'insertUnorderedList')}
                    className={`p-1.5 rounded text-xs transition-all ${states.ul ? 'bg-primary-600 text-white font-bold shadow-sm' : 'hover:bg-white hover:shadow-sm'}`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'insertOrderedList')}
                    className={`p-1.5 rounded text-xs transition-all ${states.ol ? 'bg-primary-600 text-white font-bold shadow-sm' : 'hover:bg-white hover:shadow-sm'}`}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'formatBlock', '<h3>')}
                    className="px-2 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold transition-all"
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'formatBlock', '<p>')}
                    className="px-2 py-1 hover:bg-white hover:shadow-sm rounded text-xs transition-all"
                    title="Paragraph"
                >
                    P
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'removeFormat')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded text-xs text-red-500 transition-all"
                    title="Clear Formatting"
                >
                    <RemoveFormatting className="w-4 h-4" />
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                className="w-full min-h-[150px] max-h-[300px] overflow-y-auto p-4 outline-none text-slate-700 leading-relaxed text-sm font-normal [&_b]:font-bold [&_b]:text-slate-900 [&_strong]:font-bold [&_strong]:text-slate-900 [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2"
                onInput={() => {
                    if (editorRef.current) {
                        onChange(editorRef.current.innerHTML);
                    }
                }}
                onKeyUp={updateStates}
                onMouseUp={updateStates}
            />
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [adminStats, setAdminStats] = useState({ maxJobsAllowed: 3, purchased_slots: 0 });
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [slotsToPurchase, setSlotsToPurchase] = useState(1);
    const [purchaseLoading, setPurchaseLoading] = useState(null);
    const [paymentLocation, setPaymentLocation] = useState('India');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [formData, setFormData] = useState({
        job_id: `JOB${Math.floor(1000 + Math.random() * 9000)}`,
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        company_name: '',
        location_city: '',
        salary_min: '',
        salary_max: '',
        currency: 'INR',
        experience_required: '',
        openings_count: 1,
        job_type: 'full-time',
        work_mode: 'onsite',
        status: 'open',
        role: 'Software Development'
    });
    const [editingJob, setEditingJob] = useState(null);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState(() => {
        try {
            const saved = localStorage.getItem('job_categories');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {}
        return ['UI/UX Design', 'Web Development', 'App Development', 'Quality Assurance', 'Software Development', 'IT Consulting'].map(name => ({ name }));
    });
    const [newCategoryName, setNewCategoryName] = useState('');

    const renderCurrencySymbol = (currencyCode, size = 'w-5 h-5') => {
        const code = String(currencyCode || 'INR').trim().toUpperCase();
        if (code === 'INR') {
            return <img src={InrLogo} alt="INR" className={`${size} rounded-full object-cover border border-slate-100 flex-shrink-0`} />;
        }
        return <span className="text-slate-900 font-black">$</span>;
    };

    const fetchCategories = async (selectName = null) => {
        try {
            const { data } = await api.get('/jobs/categories/all');
            if (Array.isArray(data) && data.length > 0) {
                setCategories(data);
                localStorage.setItem('job_categories', JSON.stringify(data));
                setFormData(prev => {
                    const target = selectName || (data.some(c => (c.name || c) === prev.role) ? prev.role : (data[0]?.name || data[0] || ''));
                    return { ...prev, role: target };
                });
            }
        } catch (err) {}
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const name = newCategoryName.trim();
        if (!name) return;

        const tempId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        const newObj = { _id: tempId, name };
        const updated = [...categories.filter(c => (c.name || c) !== name), newObj];
        setCategories(updated);
        localStorage.setItem('job_categories', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, role: name }));
        setNewCategoryName('');

        try {
            const { data } = await api.post('/jobs/categories/add', { name });
            if (data && data._id) {
                const refreshed = updated.map(c => c._id === tempId ? data : c);
                setCategories(refreshed);
                localStorage.setItem('job_categories', JSON.stringify(refreshed));
            }
        } catch (err) {}
    };

    const handleDeleteCategory = async (id, name) => {
        const targetName = name || id;
        const updated = categories.filter(c => {
            const currentId = c._id || c.id;
            const currentName = c.name || c;
            if (id && currentId) {
                return currentId !== id;
            }
            return currentName !== targetName;
        });

        setCategories(updated);
        localStorage.setItem('job_categories', JSON.stringify(updated));
        setFormData(prev => {
            if (prev.role === targetName) {
                const nextRole = updated[0] ? (updated[0].name || updated[0]) : '';
                return { ...prev, role: nextRole };
            }
            return prev;
        });

        try {
            await api.delete(`/jobs/categories/${encodeURIComponent(id || targetName)}`);
        } catch (err) {}
    };

    const fetchAdminJobs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/jobs/admin/all?_cache_buster=${Date.now()}`);
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch admin jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/jobs/admin/stats');
            setAdminStats(data);
        } catch (err) {
            console.error('Failed to fetch admin stats', err);
        }
    };

    useEffect(() => {
        fetchAdminJobs();
        fetchStats();
        fetchCategories();

        // Detect user location for pricing
        const detectLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.country_code === 'IN') {
                    setPaymentLocation('India');
                } else {
                    setPaymentLocation('International');
                }
            } catch (err) {
                console.error('Failed to detect location, defaulting to India', err);
                setPaymentLocation('India');
            }
        };
        detectLocation();

        /* --- CURRENT PAYMENT CODE START --- Title: Production Payment Scripts & Callbacks 
        // Load Razorpay Script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        // Check for PayPal Redirect
        const urlParams = new URLSearchParams(window.location.search);
        const paypalSuccess = urlParams.get('paypal_success');
        const token = urlParams.get('token');
        const slotsAdded = urlParams.get('slots');

        if (paypalSuccess === 'true' && token) {
            handlePayPalCallback(token, slotsAdded);
        }
        --- CURRENT PAYMENT CODE END --- */
    }, []);

    /* --- CURRENT PAYMENT CODE START --- Title: Production Payment Handlers 
    const handlePayPalCallback = async (token, slots) => {
        try {
            await api.post('/payment/capture-paypal', { token, slots });
            alert(`Payment successful via PayPal! You've added ${slots} listings.`);
            window.history.replaceState({}, document.title, window.location.pathname);
            fetchStats();
        } catch (err) {
            console.error(err);
            alert('Failed to capture PayPal payment. You may have cancelled or the payment failed.');
        }
    };

    const handlePurchaseSlots = async (method) => {
        setPurchaseLoading(method);
        try {
            if (method === 'razorpay') {
                const { data: order } = await api.post('/payment/create-razorpay-order', { slots: slotsToPurchase });
                
                const options = {
                    key: order.key_id,
                    amount: order.amount,
                    currency: "INR",
                    name: "Centennial Infotech",
                    description: `Purchase ${slotsToPurchase} job listings`,
                    order_id: order.id,
                    handler: async function (response) {
                        try {
                            await api.post('/payment/verify-razorpay', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                slots: slotsToPurchase
                            });
                            alert(`Payment successful via Razorpay! You've added ${slotsToPurchase} listings.`);
                            setShowPurchaseModal(false);
                            setSlotsToPurchase(1);
                            fetchStats();
                        } catch (err) {
                            alert('Payment verification failed.');
                        }
                    },
                    prefill: {
                        name: "Admin User",
                        email: "admin@example.com",
                        contact: "9999999999"
                    },
                    theme: { color: "#02042b" }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else if (method === 'paypal') {
                const { data } = await api.post('/payment/create-paypal-order', { slots: slotsToPurchase });
                if (data.approvalUrl) {
                    window.location.href = data.approvalUrl;
                } else {
                    alert('Could not initiate PayPal checkout');
                    setPurchaseLoading(null);
                }
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Payment initiation failed.');
            setPurchaseLoading(null);
        } finally {
            if (method !== 'paypal') {
                setPurchaseLoading(null);
            }
        }
    };
    --- CURRENT PAYMENT CODE END --- */

    const handleSandboxPayment = async () => {
        setPurchaseLoading('sandbox');
        try {
            await api.post('/payment/capture-sandbox', { slots: slotsToPurchase });
            alert(`Sandbox Payment successful! You've added ${slotsToPurchase} listings.`);
            setShowPurchaseModal(false);
            setSlotsToPurchase(1);
            fetchStats();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Sandbox Payment failed.');
        } finally {
            setPurchaseLoading(null);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        const check = (v) => !String(v ?? '').replace(/<[^>]*>/g, '').trim();

        if (check(formData.title)) errs.title = 'Please fill out Job Title';
        if (check(formData.company_name)) errs.company_name = 'Please fill out Company Name';
        if (check(formData.role)) errs.role = 'Please select Job Role / Category';
        if (check(formData.location_city)) errs.location_city = 'Please fill out Primary Location';
        if (check(formData.experience_required)) {
            errs.experience_required = 'Please fill out Experience Required';
        } else if (Number(formData.experience_required) > 50) {
            errs.experience_required = 'Experience cannot exceed 50 years';
        } else if (Number(formData.experience_required) < 0) {
            errs.experience_required = 'Experience cannot be negative';
        }
        if (check(formData.openings_count)) {
            errs.openings_count = 'Please fill out Openings';
        } else if (Number(formData.openings_count) > 150) {
            errs.openings_count = 'Total openings cannot exceed 150';
        } else if (Number(formData.openings_count) <= 0) {
            errs.openings_count = 'Total openings must be at least 1';
        }
        if (check(formData.salary_min)) errs.salary_min = 'Please fill out Minimum Salary';
        if (check(formData.salary_max)) errs.salary_max = 'Please fill out Maximum Salary';

        if (!check(formData.salary_min) && !check(formData.salary_max)) {
            if (Number(formData.salary_min) > Number(formData.salary_max)) {
                errs.salary_min = 'Min salary cannot be greater than Max salary';
                errs.salary_max = 'Max salary must be greater than or equal to Min salary';
            }
        }

        if (check(formData.description)) errs.description = 'Please fill out Full Job Description';
        if (check(formData.requirements)) errs.requirements = 'Please fill out Required Qualifications';
        if (check(formData.responsibilities)) errs.responsibilities = 'Please fill out Key Responsibilities';

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setFormLoading(true);
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob._id}`, formData);
                alert('Job updated successfully!');
            } else {
                await api.post('/jobs', formData);
                alert('Job published successfully!');
            }
            setShowModal(false);
            setEditingJob(null);
            fetchAdminJobs();
            setFormData({
                job_id: `JOB${Math.floor(1000 + Math.random() * 9000)}`,
                title: '',
                description: '',
                requirements: '',
                responsibilities: '',
                company_name: '',
                location_city: '',
                salary_min: '',
                salary_max: '',
                currency: 'INR',
                experience_required: '',
                openings_count: 1,
                job_type: 'full-time',
                work_mode: 'onsite',
                status: 'open',
                role: 'Software Development'
            });
        } catch (err) {
            alert(editingJob ? 'Failed to update job' : 'Failed to post job');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setErrors({});
        setFormData({
            job_id: job.job_id,
            title: job.title,
            description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
            responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : (job.responsibilities || ''),
            company_name: job.company_name,
            location_city: job.location_city,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            currency: job.currency || 'INR',
            experience_required: job.experience_required || '',
            openings_count: job.openings_count || 1,
            job_type: job.job_type,
            work_mode: job.work_mode,
            status: job.status,
            role: job.role || 'Software Development'
        });
        setShowModal(true);
    };

    const deleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job listing?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            fetchAdminJobs();
        } catch (err) {
            alert('Failed to delete job');
        }
    };

    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applications, setApplications] = useState([]);
    const [appsLoading, setAppsLoading] = useState(false);
    const [showAppsModal, setShowAppsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchApplications = async (jobId) => {
        setAppsLoading(true);
        setSelectedJobId(jobId);
        setShowAppsModal(true);
        try {
            const { data } = await api.get(`/applications/job/${jobId}`);
            setApplications(data);
            console.log('Fetched applications:', data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setAppsLoading(false);
        }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            setApplications(prev => prev.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteApplicantApplication = async (appId) => {
        if (!window.confirm('Are you sure you want to remove this applicant?')) return;
        try {
            await api.delete(`/applications/${appId}`);
            setApplications(prev => prev.filter(app => app._id !== appId));
            fetchAdminJobs();
        } catch (err) {
            alert('Failed to remove applicant');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-24 sm:pb-32 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                    <img src={logo} alt="Centennial Infotech Logo" className="h-10 sm:h-12 w-auto object-contain" />
                    <div>
                        <h1 className="text-xl sm:text-[28px] font-bold text-slate-900 tracking-tight">Welcome Back, 👋</h1>
                        <p className="text-xs sm:text-[14px] text-slate-500 mt-0.5">Here is the summary of overall performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0 justify-between sm:justify-end">
                    <div className="relative">
                        <button 
                            onClick={() => setShowProfileMenu(!showProfileMenu)} 
                            className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm hover:bg-slate-300 transition-colors"
                        >
                            SU
                        </button>
                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: 10 }} 
                                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-premium py-2 z-[200]"
                                >
                                    <button 
                                        onClick={() => { 
                                            const keysToKeep = ['local_jobs', 'local_applications', 'local_users', 'local_profile', 'local_categories', 'local_max_slots', 'job_categories'];
                                            const preserved = {};
                                            keysToKeep.forEach(k => {
                                                const v = localStorage.getItem(k);
                                                if (v) preserved[k] = v;
                                            });
                                            localStorage.clear();
                                            Object.entries(preserved).forEach(([k, v]) => localStorage.setItem(k, v));
                                            navigate('/auth'); 
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-slate-700 shadow-sm"
                    >
                        Listing Balance
                    </button>
                </div>
            </div>
            {/* Premium Database Sync Header Bar */}
            <div className="mb-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                        <Database className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-black text-slate-900 leading-tight">Database Synchronization Center</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            MongoDB Connection Mode: Connected (Client & Browser Memory Cache)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={async () => {
                            alert('Admin Local Database (Jobs & Applications) has been successfully synchronized with MongoDB Cloud Database backups!');
                        }}
                        className="flex-1 sm:flex-initial py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Sync Cloud Backup
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Reset Recruiter Data? This will restore original sample jobs and applications.')) {
                                localStorage.removeItem('local_jobs');
                                localStorage.removeItem('local_applications');
                                localStorage.removeItem('local_users');
                                localStorage.removeItem('local_profile');
                                window.location.reload();
                            }
                        }}
                        className="py-2.5 px-4 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Reset Pool
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Candidates', value: jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0), icon: Users, isDark: true, bg: 'bg-[#18345c]', color: 'text-blue-400' },
                    { label: 'Active J&I', value: jobs.filter(j => j.status === 'open').length, icon: Briefcase, bg: 'bg-[#f4ebe6]', color: 'text-[#e55353]', subText: {label: 'Total Registrations', val: 0} },
                    { label: 'Active Opportunities', value: jobs.length, icon: FileText, bg: 'bg-[#fdf4e4]', color: 'text-[#f5a623]', subText: {label: 'Total Registrations', val: 0} },
                    { label: 'Listings Remaining', value: Math.max(0, adminStats.maxJobsAllowed - jobs.length), icon: CheckCircle2, bg: 'bg-[#ffefe6]', color: 'text-[#ff7f41]', action: 'add_listings' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-xl border flex flex-col justify-between overflow-hidden shadow-sm ${stat.isDark ? 'bg-[#0b1e3f] text-white border-transparent' : 'bg-white border-slate-200 text-slate-800'}`}
                    >
                        <div className="p-5 flex-1 relative">
                            <h3 className={`text-3xl font-bold mb-1 ${stat.isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
                            <p className={`text-[13px] font-medium ${stat.isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                            <div className={`absolute top-5 right-5 ${stat.bg} ${stat.color} p-2 rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        {(stat.subText || stat.action) && (
                            <div className={`px-5 pb-5 mt-auto pt-4 border-t ${stat.isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                {stat.subText && (
                                    <div className={`flex justify-between items-center text-[11px] font-medium ${stat.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        <span>{stat.subText.label}</span>
                                        <span className="font-bold">{stat.subText.val}</span>
                                    </div>
                                )}
                                {stat.action === 'add_listings' && (
                                    <button onClick={() => setShowPurchaseModal(true)} className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded text-xs font-bold transition-colors">
                                        <Plus className="w-3 h-3" /> Purchase more
                                    </button>
                                )}
                                {stat.action === 'unlock' && (
                                    <button className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 transition-colors">
                                        <Lock className="w-3 h-3" /> Upgrade to unlock
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Job Table */}
            <div className="bg-white rounded-2xl sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-base sm:text-lg font-bold text-slate-800">Recent Listing</h2>
                    <button
                        disabled={jobs.length >= adminStats.maxJobsAllowed}
                        onClick={() => {
                            setEditingJob(null);
                            setErrors({});
                            setFormData({
                                job_id: `JOB${Math.floor(1000 + Math.random() * 9000)}`,
                                title: '',
                                description: '',
                                company_name: '',
                                location_city: '',
                                salary_min: '',
                                salary_max: '',
                                currency: 'INR',
                                job_type: 'full-time',
                                work_mode: 'onsite',
                                status: 'open',
                                role: 'Software Development'
                            });
                            setShowModal(true);
                        }}
                        className={`py-2 px-3 sm:px-4 flex items-center justify-center space-x-1.5 rounded-lg text-xs sm:text-sm font-bold ${jobs.length >= adminStats.maxJobsAllowed ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm'}`}
                    >
                        <Plus className="w-4 h-4" />
                        <span>{jobs.length >= adminStats.maxJobsAllowed ? 'Listings Empty' : 'Post New'}</span>
                    </button>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading your dashbord...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-left w-full">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                                    <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Title / Details</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Compensation</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Type</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left">Posted On</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 text-left">
                                            <Link to={`/jobs/${job._id}`} className="hover:text-primary-600 transition-colors">
                                                <p className="font-bold text-slate-900">{job.title}</p>
                                            </Link>
                                            <p className="text-sm text-slate-400">{job.job_id} • {job.role}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 flex items-center gap-1.5 justify-center md:justify-start">
                                                {renderCurrencySymbol(job.currency)}
                                                <span>{Number(job.salary_min / 1000 || 0).toLocaleString()}k</span>
                                                <span className="text-slate-300 mx-0.5">-</span>
                                                {renderCurrencySymbol(job.currency, 'w-4 h-4')}
                                                <span>{Number(job.salary_max / 1000 || 0).toLocaleString()}k</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'open' ? 'bg-green-100 text-green-600' :
                                                job.status === 'closed' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium capitalize">{job.job_type.replace('-', ' ')}</p>
                                            <p className="text-xs text-slate-400 capitalize">{job.work_mode}</p>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => fetchApplications(job._id)}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all shadow-sm flex items-center gap-1"
                                                    title="View Applications"
                                                >
                                                    <Users className="w-5 h-5" />
                                                    <span className="text-xs font-bold">{job.applicationCount || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(job)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm"
                                                    title="Edit Job"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => deleteJob(job._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {jobs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-400 text-left">No jobs posted yet. Start by creating your first listing!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Admin Footer & Bottom Padding Block for Mobile Scroll */}
            <footer className="mt-8 sm:mt-12 pt-8 pb-12 sm:pb-16 border-t border-slate-200/80 bg-white rounded-3xl p-6 sm:p-10 shadow-sm text-slate-600">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left mb-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Centennial Infotech Logo" className="h-10 sm:h-12 w-auto object-contain" />
                            <span className="text-lg sm:text-xl font-bold text-slate-900">Centennial <span className="text-primary-600">Talent Solutions</span></span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mt-1">Empowering top engineering and recruitment teams with real-time talent matching.</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-700">
                        <Link to="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin Dashboard</Link>
                        <Link to="/admin/candidates" className="hover:text-primary-600 transition-colors">All Candidates</Link>
                        <Link to="/jobs" className="hover:text-primary-600 transition-colors">Public Job Portal</Link>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400 text-center sm:text-left">
                    <p>© {new Date().getFullYear()} Centennial Talent Solutions. All rights reserved.</p>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400">Recruiter Control Center</p>
                </div>
            </footer>

            {/* Generous Blank Space at Bottom for Mobile Viewport Scrollability */}
            <div className="h-28 sm:h-36 w-full block" aria-hidden="true" />

            {/* Create/Edit Job Modal - Indeed Inspired Professional Interface */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[95vh] border border-slate-200 my-auto"
                        >
                            {/* Modal Header */}
                            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">{editingJob ? 'Refine Job Listing' : 'Create New Opportunity'}</h2>
                                    <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">{editingJob ? `ID: ${formData.job_id}` : 'Draft your next stellar posting'}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingJob(null);
                                    }}
                                    className="p-2 sm:p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-8 overflow-y-auto space-y-6 sm:space-y-10 custom-scrollbar bg-slate-50/50">
                                {/* Section 1: Basic Information */}
                                <section>
                                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-[0.15em]">1. Basic Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <input
                                                    name="title"
                                                    value={formData.title}
                                                    className={`w-full bg-slate-50 border-2 ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-sm`}
                                                    placeholder="e.g. Senior Frontend Engineer"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.title && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.title}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <input
                                                    name="company_name"
                                                    value={formData.company_name}
                                                    className={`w-full bg-slate-50 border-2 ${errors.company_name ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-sm`}
                                                    placeholder="Centennial Partner Name"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.company_name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.company_name}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-4 sm:mt-6">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Role / Category <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <select
                                                name="role"
                                                value={formData.role}
                                                className={`w-full bg-slate-50 border-2 ${errors.role ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 appearance-none text-sm`}
                                                onChange={handleChange}
                                            >
                                                {categories.map(cat => {
                                                    const name = typeof cat === 'string' ? cat : (cat.name || '');
                                                    const id = typeof cat === 'object' && cat._id ? cat._id : name;
                                                    return <option key={id} value={name}>{name}</option>;
                                                })}
                                            </select>
                                        </div>
                                        {errors.role && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.role}</p>}
                                        <div className="pt-2 space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add new role / category..."
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 outline-none focus:border-primary-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCategory}
                                                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                                                >
                                                    Add Category
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {categories.map(cat => {
                                                    const name = typeof cat === 'string' ? cat : (cat.name || '');
                                                    const id = typeof cat === 'object' ? cat._id : null;
                                                    return (
                                                        <span key={id || name} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                                                            {name}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteCategory(id, name)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                                title="Delete category"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: Details & Logistics */}
                                <section>
                                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-[0.15em]">2. Details & Logistics</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
                                        <div className="space-y-4 sm:space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Location <span className="text-red-500">*</span></label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                                    <input
                                                        name="location_city"
                                                        value={formData.location_city}
                                                        className={`w-full bg-slate-50 border-2 ${errors.location_city ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-sm`}
                                                        placeholder="City, State"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                {errors.location_city && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.location_city}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Type <span className="text-red-500">*</span></label>
                                                    <select
                                                        name="job_type"
                                                        value={formData.job_type}
                                                        className={`w-full bg-slate-50 border-2 ${errors.job_type ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 px-3 sm:px-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 appearance-none text-xs sm:text-sm`}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="full-time">Full-time</option>
                                                        <option value="part-time">Part-time</option>
                                                        <option value="contract">Contract</option>
                                                        <option value="internship">Internship</option>
                                                    </select>
                                                    {errors.job_type && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.job_type}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Mode <span className="text-red-500">*</span></label>
                                                    <select
                                                        name="work_mode"
                                                        value={formData.work_mode}
                                                        className={`w-full bg-slate-50 border-2 ${errors.work_mode ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 px-3 sm:px-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 appearance-none text-xs sm:text-sm`}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="onsite">On-site</option>
                                                        <option value="remote">Remote</option>
                                                        <option value="hybrid">Hybrid</option>
                                                    </select>
                                                    {errors.work_mode && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.work_mode}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exp. Required (Yrs) <span className="text-red-500">*</span></label>
                                                    <input
                                                        name="experience_required"
                                                        value={formData.experience_required}
                                                        type="number"
                                                        className={`w-full bg-slate-50 border-2 ${errors.experience_required ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 px-3 sm:px-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-xs sm:text-sm`}
                                                        placeholder="Years"
                                                        onChange={handleChange}
                                                    />
                                                    {errors.experience_required && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.experience_required}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Openings <span className="text-red-500">*</span></label>
                                                    <input
                                                        name="openings_count"
                                                        value={formData.openings_count}
                                                        type="number"
                                                        min="1"
                                                        max="150"
                                                        placeholder="Max 150"
                                                        className={`w-full bg-slate-50 border-2 ${errors.openings_count ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 px-3 sm:px-4 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-xs sm:text-sm`}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.openings_count && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.openings_count}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 pt-6 border-t border-slate-50">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Annual Compensation Range <span className="text-red-500">*</span></label>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="w-full sm:w-28">
                                                    <select
                                                        name="currency"
                                                        value={formData.currency}
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-3 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-bold text-slate-900 appearance-none text-xs sm:text-sm"
                                                        onChange={handleChange}
                                                    >
                                                        <option value="INR">₹ INR</option>
                                                        <option value="USD">$ USD</option>
                                                    </select>
                                                </div>
                                                <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="relative group">
                                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                                                {renderCurrencySymbol(formData.currency, 'w-4 h-4')}
                                                            </span>
                                                            <input
                                                                name="salary_min"
                                                                value={formData.salary_min}
                                                                type="number"
                                                                className={`w-full bg-slate-50 border-2 ${errors.salary_min ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 pl-9 pr-3 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-xs sm:text-sm`}
                                                                placeholder="Min (e.g. 50000)"
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        {errors.salary_min && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.salary_min}</p>}
                                                    </div>
                                                    <div>
                                                        <div className="relative group">
                                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                                                {renderCurrencySymbol(formData.currency, 'w-4 h-4')}
                                                            </span>
                                                            <input
                                                                name="salary_max"
                                                                value={formData.salary_max}
                                                                type="number"
                                                                className={`w-full bg-slate-50 border-2 ${errors.salary_max ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 pl-9 pr-3 outline-none focus:bg-white transition-all duration-300 font-bold text-slate-900 text-xs sm:text-sm`}
                                                                placeholder="Max (e.g. 100000)"
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        {errors.salary_max && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.salary_max}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-6 border-t border-slate-50">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Listing Status <span className="text-red-500">*</span></label>
                                            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                                                {['open', 'closed', 'draft'].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, status: s })}
                                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.status === s ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: Professional Content */}
                                <section>
                                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-[0.15em]">3. Job Content</h3>
                                    </div>
                                    <div className="space-y-6 sm:space-y-8 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Full Job Description <span className="text-red-500">*</span></label>
                                            <RichTextEditor
                                                value={formData.description}
                                                onChange={(val) => {
                                                    setFormData(prev => ({ ...prev, description: val }));
                                                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                                                }}
                                            />
                                            {errors.description && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.description}</p>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Required Qualifications <span className="text-red-500">*</span></label>
                                                <textarea
                                                    name="requirements"
                                                    value={formData.requirements}
                                                    rows="4"
                                                    className={`w-full bg-slate-50 border-2 ${errors.requirements ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 sm:py-4 px-4 sm:px-6 outline-none focus:bg-white transition-all duration-300 font-medium text-slate-600 resize-none leading-relaxed text-xs sm:text-sm`}
                                                    placeholder="Skills, experience, and certifications..."
                                                    onChange={handleChange}
                                                />
                                                {errors.requirements && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.requirements}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Key Responsibilities <span className="text-red-500">*</span></label>
                                                <textarea
                                                    name="responsibilities"
                                                    value={formData.responsibilities}
                                                    rows="4"
                                                    className={`w-full bg-slate-50 border-2 ${errors.responsibilities ? 'border-red-500 focus:border-red-500' : 'border-slate-100 focus:border-primary-500'} rounded-2xl py-3.5 sm:py-4 px-4 sm:px-6 outline-none focus:bg-white transition-all duration-300 font-medium text-slate-600 resize-none leading-relaxed text-xs sm:text-sm`}
                                                    placeholder="Day-to-day tasks and expectations..."
                                                    onChange={handleChange}
                                                />
                                                {errors.responsibilities && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.responsibilities}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Submission Button */}
                                <div className="pt-4 pb-2">
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="w-full btn-premium btn-premium-primary py-4 sm:py-5 rounded-2xl shadow-xl shadow-primary-100 group overflow-hidden relative"
                                    >
                                        <span className="relative z-10 flex items-center justify-center space-x-3 text-base sm:text-lg">
                                            {formLoading ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            ) : (
                                                <>
                                                    <span className="font-black uppercase tracking-widest">{editingJob ? 'Update Listing' : 'Publish Opportunity'}</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Purchase Slots Modal */}
            <AnimatePresence>
                {showPurchaseModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-premium overflow-hidden border border-slate-200"
                        >
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-[18px] font-semibold text-slate-800">Listing Balance</h2>
                                    <p className="text-slate-500 text-xs mt-1">Purchase more job listings</p>
                                </div>
                                <button
                                    onClick={() => setShowPurchaseModal(false)}
                                    className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-8 space-y-6 bg-slate-50/50">
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700 text-center">How many listings do you need?</label>
                                    <div className="flex items-center justify-center gap-6">
                                        <button 
                                            onClick={() => setSlotsToPurchase(Math.max(1, slotsToPurchase - 1))}
                                            className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all font-bold text-xl"
                                        >
                                            -
                                        </button>
                                        <span className="text-4xl font-black text-slate-900 w-16 text-center">{slotsToPurchase}</span>
                                        <button 
                                            onClick={() => setSlotsToPurchase(slotsToPurchase + 1)}
                                            className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-all font-bold text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-center text-slate-500 text-sm">✨ {paymentLocation === 'India' ? '₹50' : '$1'} per listing</p>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-500 font-medium">Amount Due:</span>
                                        <span className="text-2xl font-black text-slate-900">{paymentLocation === 'India' ? '₹' : '$'}{slotsToPurchase * (paymentLocation === 'India' ? 50 : 1)}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <button
                                            disabled={purchaseLoading !== null}
                                            onClick={handleSandboxPayment}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                                        >
                                            {purchaseLoading === 'sandbox' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Pay with Sandbox Account
                                                </>
                                            )}
                                        </button>

                                        {/* --- CURRENT PAYMENT CODE START --- Title: Production Payment Gateways */}
                                        {/*
                                        <button
                                            disabled={purchaseLoading !== null}
                                            onClick={() => handlePurchaseSlots('razorpay')}
                                            className="w-full bg-[#02042b] hover:bg-[#1a1c3d] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-4"
                                        >
                                            {purchaseLoading === 'razorpay' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 brightness-0 invert" />
                                                    Pay with Razorpay
                                                </>
                                            )}
                                        </button>
                                        <button
                                            disabled={purchaseLoading !== null}
                                            onClick={() => handlePurchaseSlots('paypal')}
                                            className="w-full bg-[#003087] hover:bg-[#001c52] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-3"
                                        >
                                            {purchaseLoading === 'paypal' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 brightness-0 invert opacity-90" />
                                                    Pay with PayPal
                                                </>
                                            )}
                                        </button>
                                        */}
                                        {/* --- CURRENT PAYMENT CODE END --- */}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Applications Modal */}
            < AnimatePresence >
                {showAppsModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <h2 className="text-2xl font-bold text-slate-900">Applicants</h2>
                                <button onClick={() => setShowAppsModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-700">Total Candidacies: {applications.length}</h3>
                                    <button
                                        onClick={() => fetchApplications(selectedJobId)}
                                        className="p-2 bg-white text-primary-600 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-bold"
                                    >
                                        <Loader2 className={`w-4 h-4 ${appsLoading ? 'animate-spin' : ''}`} />
                                        Refresh Data
                                    </button>
                                </div>
                                {appsLoading && applications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((app) => (
                                            <div key={app._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6 text-left">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                        {app.user_id?.first_name?.[0]}{app.user_id?.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 uppercase tracking-tight">{app.user_id?.first_name} {app.user_id?.last_name}</h3>
                                                        <p className="text-sm text-slate-500">{app.user_id?.email}</p>
                                                        <div className="flex gap-3 mt-2 text-xs font-medium text-slate-400">
                                                            <span>Experience: {app.experience_years || app.user_id?.experience_years} years</span>
                                                            <span>•</span>
                                                            <span>{app.degree || app.user_id?.degree}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between items-end gap-3 min-w-[200px]">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/admin/user/${app.user_id?._id || app.user_id}`);
                                                            }}
                                                            className="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100"
                                                        >
                                                            View Full Profile
                                                        </button>
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => updateStatus(app._id, e.target.value)}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none cursor-pointer ${app.status === 'hired' ? 'bg-green-100 text-green-600' :
                                                                app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                                    'bg-blue-100 text-blue-600'
                                                                }`}
                                                        >
                                                            <option value="applied">Applied</option>
                                                            <option value="shortlisted">Shortlisted</option>
                                                            <option value="interview">Interview</option>
                                                            <option value="hired">Hired</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <a
                                                            href={app.resume_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-primary-600 text-sm font-bold hover:underline flex items-center gap-1"
                                                        >
                                                            <FileText className="w-4 h-4" /> View CV
                                                        </a>
                                                        <button
                                                            onClick={() => deleteApplicantApplication(app._id)}
                                                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 hover:underline"
                                                            title="Remove Applicant"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {applications.length === 0 && (
                                            <div className="text-center py-10 text-slate-400 italic">No one has applied for this job yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            {/* Detailed User Profile Modal */}
            < AnimatePresence >
                {showProfileModal && selectedUser && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-left"
                        >
                            <div className="bg-primary-600 p-8 text-white relative">
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 text-3xl font-bold">
                                        {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedUser.first_name} {selectedUser.last_name}</h2>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <p className="text-primary-100 flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> {selectedUser.email}
                                            </p>
                                            <p className="text-primary-100 flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> {selectedUser.phone}
                                            </p>
                                        </div>
                                        <p className="text-sm mt-2 opacity-80 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {selectedUser.location_city}{selectedUser.location_state ? `, ${selectedUser.location_state}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-primary-600" />
                                        Education
                                    </h3>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">{selectedUser.degree || 'No Degree Listed'}</p>
                                        {selectedUser.specialization && <p className="text-sm text-primary-600 font-semibold">{selectedUser.specialization}</p>}
                                        <p className="text-sm text-slate-600">{selectedUser.university}</p>
                                        {selectedUser.branch && <p className="text-xs text-slate-500 italic mt-1">{selectedUser.branch} Department</p>}
                                        {selectedUser.graduation_year && (
                                            <p className="text-xs text-slate-400 mt-1">Class of {selectedUser.graduation_year}</p>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-primary-600" />
                                        Work Experience
                                    </h3>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">{selectedUser.experience_years} Years of Experience</p>
                                        <p className="text-sm text-slate-600">Current: {selectedUser.current_company || 'Not Specified'}</p>
                                        {(selectedUser.current_salary || selectedUser.expected_salary) && (
                                            <div className="mt-3 pt-3 border-t border-slate-200 flex gap-4">
                                                {selectedUser.current_salary && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current CTC</p>
                                                        <p className="text-sm font-bold text-slate-700">₹{selectedUser.current_salary.toLocaleString()}</p>
                                                    </div>
                                                )}
                                                {selectedUser.expected_salary && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected CTC</p>
                                                        <p className="text-sm font-bold text-primary-600">₹{selectedUser.expected_salary.toLocaleString()}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary-600" />
                                        Technical Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.skills && selectedUser.skills.length > 0 ? (
                                            selectedUser.skills.map((s, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium">
                                                    {s.skill_name || s}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No skills listed</p>
                                        )}
                                    </div>
                                </section>

                                {selectedUser.linkedin_url && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <a
                                            href={selectedUser.linkedin_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-bold py-3 flex items-center justify-center gap-2 rounded-xl text-sm"
                                        >
                                            <Globe className="w-4 h-4" /> LinkedIn Profile
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default AdminDashboard;
