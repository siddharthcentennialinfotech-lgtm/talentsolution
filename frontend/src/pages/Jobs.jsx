import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Filter, Loader2, ArrowRight, X, FileText, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InrLogo from '../assets/inr-logo.jpg';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Centralized currency display logic
    const renderCurrencySymbol = (currencyCode, size = 'w-5 h-5') => {
        const code = String(currencyCode || 'INR').trim().toUpperCase();
        if (code === 'INR') {
            return <img src={InrLogo} alt="INR" className={`${size} rounded-full inline-block object-cover border border-slate-100 flex-shrink-0`} />;
        }
        return <span className="text-slate-900 font-black">$</span>;
    };
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/jobs/categories/all')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setCategories(res.data);
                }
            })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // Application state
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        resume_url: '',
        cover_letter: '',
        degree: '',
        branch: '',
        university: '',
        experience_years: '',
        current_company: ''
    });
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [successToast, setSuccessToast] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const fileInputRef = React.useRef(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (location) params.append('location', location);
            if (jobType) params.append('job_type', jobType);
            if (selectedRole) params.append('role', selectedRole);

            const { data } = await api.get(`/jobs?${params.toString()}&_cb=${Date.now()}`);
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [jobType, selectedRole]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleApplyClick = async (job) => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (role !== 'user') {
            alert('Only job seekers can apply for jobs.');
            return;
        }

        // Pre-fill form with profile data
        try {
            const { data } = await api.get('/auth/user/profile');
            setApplicationForm(prev => ({
                ...prev,
                resume_url: data.resume_url || '',
                degree: data.degree || '',
                branch: data.branch || '',
                university: data.university || '',
                experience_years: data.experience_years || '',
                current_company: data.current_company || ''
            }));
        } catch (err) {
            console.error('Could not fetch profile for pre-fill', err);
        }

        setSelectedJob(job);
        setShowModal(true);
        setError('');
        setSuccess('');
        setUploadingResume(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
             setError('File size must be less than 5MB');
             return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setUploadingResume(true);
        setError('');
        
        try {
            const response = await api.post('/upload/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setApplicationForm(prev => ({
                ...prev,
                resume_url: response.data.url
            }));
            setSuccess('Resume uploaded successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload resume');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } finally {
            setUploadingResume(false);
        }
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        setApplying(true);
        setError('');
        try {
            await api.post('/applications', {
                job_id: selectedJob._id,
                ...applicationForm
            });
            setSuccess('Application submitted successfully!');
            setSuccessToast(true);
            setTimeout(() => {
                setShowModal(false);
                setApplicationForm({ resume_url: '', cover_letter: '' });
                setSelectedJob(null);
            }, 2000);
            setTimeout(() => {
                setSuccessToast(false);
            }, 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
            {/* Search Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Find your dream job today</h1>
                <p className="text-lg text-slate-600 mb-8">Browse thousands of job opportunities across the globe.</p>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-2xl shadow-lg border border-slate-100">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-slate-700"
                            placeholder="Job title, keywords, or company..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:block w-px bg-slate-100 my-2"></div>
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-slate-700"
                            placeholder="City, state, or country..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="md:w-32 btn-primary py-3">Search</button>
                </form>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="lg:w-64 space-y-8">
                    <div>
                        <h3 className="flex items-center text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                            <Filter className="w-4 h-4 mr-2" />
                            Job Type
                        </h3>
                        <div className="space-y-3">
                            {['', 'full-time', 'part-time', 'internship', 'contract'].map((type) => (
                                <label key={type} className="flex items-center group cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jobtype"
                                        checked={jobType === type}
                                        onChange={() => setJobType(type)}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                                    />
                                    <span className="ml-3 text-slate-600 group-hover:text-primary-600 capitalize">
                                        {type === '' ? 'All Types' : type.replace('-', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="flex items-center text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Job Category
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="radio"
                                    name="jobcategory"
                                    checked={selectedRole === ''}
                                    onChange={() => setSelectedRole('')}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                                />
                                <span className="ml-3 text-slate-600 group-hover:text-primary-600">
                                    All Categories
                                </span>
                            </label>
                            {categories.map((cat) => (
                                <label key={cat._id || cat.name} className="flex items-center group cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jobcategory"
                                        checked={selectedRole === cat.name}
                                        onChange={() => setSelectedRole(cat.name)}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                                    />
                                    <span className="ml-3 text-slate-600 group-hover:text-primary-600">
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Job Listings Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">Fetching the best opportunities...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-slate-500 font-medium">{jobs.length} jobs matching your criteria</p>
                            </div>

                            <div className="grid gap-6">
                                <AnimatePresence>
                                    {jobs.map((job, index) => (
                                        <motion.div
                                            key={job._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300"
                                        >
                                            <div className="flex flex-start justify-between">
                                                <div className="flex gap-5">
                                                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                                        <Briefcase className="w-7 h-7 text-primary-600" />
                                                    </div>
                                                    <div className="text-left">
                                                        <Link to={`/jobs/${job._id}`} className="block">
                                                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{job.title}</h2>
                                                        </Link>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-primary-600 font-semibold">{job.company_name}</p>
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            <span className="text-slate-500 text-sm font-medium">{job.role}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase">
                                                        {job.job_type}
                                                    </span>
                                                    <p className="text-slate-400 text-xs mt-2 flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(job.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center px-4 py-2 bg-slate-50 rounded-lg">
                                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                                    {job.location_city}, {job.country}
                                                </div>
                                                <div className="flex items-center px-4 py-2 bg-slate-50 rounded-lg gap-2">
                                                    {renderCurrencySymbol(job.currency)}
                                                    <span className="font-bold text-slate-700">
                                                        {Number(job.salary_min / 1000 || 0).toLocaleString()}k
                                                    </span>
                                                    <span className="text-slate-300">-</span>
                                                    {renderCurrencySymbol(job.currency, 'w-4 h-4')}
                                                    <span className="font-bold text-slate-700">
                                                        {Number(job.salary_max / 1000 || 0).toLocaleString()}k
                                                    </span>
                                                </div>
                                                <div className="flex items-center px-4 py-2 bg-slate-50 rounded-lg capitalize">
                                                    <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                                                    {job.work_mode}
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                                                <p className="text-slate-500 text-sm line-clamp-2 max-w-lg">
                                                    {job.description?.replace(/<[^>]*>/g, '')}
                                                </p>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="text-slate-900 hover:text-primary-600 border border-slate-200 hover:border-primary-600 bg-white hover:bg-slate-50 py-2 px-6 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
                                                >
                                                    <span>View detail</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {jobs.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                        <p className="text-slate-400">No jobs found matching your search. Try different keywords or location.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && selectedJob && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Apply to Position</h2>
                                    <p className="text-primary-600 font-bold text-sm uppercase">{selectedJob.title}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleApplicationSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center">
                                        <X className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-medium flex items-center">
                                        <Send className="w-4 h-4 mr-2" />
                                        {success}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Highest Degree</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="e.g. Master in CS"
                                            value={applicationForm.degree}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, degree: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Branch / Dept</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="e.g. Computer Science"
                                            value={applicationForm.branch}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, branch: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">University</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="University Name"
                                            value={applicationForm.university}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, university: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Years of Experience</label>
                                        <input
                                            required
                                            type="number"
                                            className="input-field text-left py-2 px-3"
                                            placeholder="0"
                                            value={applicationForm.experience_years}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, experience_years: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Current/Last Company</label>
                                        <input
                                            className="input-field text-left py-2 px-3"
                                            placeholder="Company Name"
                                            value={applicationForm.current_company}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, current_company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Resume Document (PDF/DOC)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2 w-5 h-5 text-slate-300" />
                                        <div className="flex gap-2">
                                            <input
                                                required={!applicationForm.resume_url}
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                className="input-field pl-11 py-2 px-3 text-left file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    {uploadingResume && (
                                        <p className="text-xs text-primary-500 font-medium mt-2 flex items-center">
                                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                            Uploading resume securely...
                                        </p>
                                    )}
                                    {applicationForm.resume_url && !uploadingResume && (
                                        <p className="text-xs text-green-500 font-medium mt-2 flex items-center">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Resume URL attached
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-left">Cover Letter (Optional)</label>
                                    <textarea
                                        rows="3"
                                        className="input-field resize-none py-2 px-3 text-left"
                                        placeholder="Why should we hire you?"
                                        value={applicationForm.cover_letter}
                                        onChange={(e) => setApplicationForm({ ...applicationForm, cover_letter: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={applying || success === 'Application submitted successfully!' || uploadingResume || !applicationForm.resume_url}
                                    className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
                                >
                                    {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <span>Submit Application</span>
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Toast Overlay */}
            <AnimatePresence>
                {successToast && (
                    <div className="fixed bottom-10 right-10 z-[300]">
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
                        >
                            <CheckCircle2 className="w-6 h-6" />
                            Application Submitted Successfully!
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Jobs;

