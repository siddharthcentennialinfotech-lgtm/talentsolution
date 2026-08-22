import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Clock, CheckCircle, XCircle, FileText, Briefcase, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/applications/my/all');
            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch applications', err);
            setError('Failed to load applications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-600';
            case 'shortlisted': return 'bg-purple-100 text-purple-600';
            case 'interview': return 'bg-amber-100 text-amber-600';
            case 'hired': return 'bg-green-100 text-green-600';
            case 'rejected': return 'bg-red-100 text-red-600';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'hired': return <CheckCircle className="w-5 h-5" />;
            case 'rejected': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const formatDate = (app) => {
        const raw = app.applied_at || app.createdAt;
        if (!raw) return 'N/A';
        return new Date(raw).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Application Status</h1>
                <p className="text-lg text-slate-500 mt-2">Track your progress and updates from recruiters</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Applications...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <p className="text-slate-700 font-bold mb-4">{error}</p>
                    <button onClick={fetchApplications} className="btn-primary py-2 px-6">Retry</button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app, index) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-primary-600">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <Link to={`/jobs/${app.job_id?._id}`} className="block">
                                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                                                {app.job_id?.title || 'Job No Longer Available'}
                                            </h3>
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500">
                                            <span className="font-bold text-primary-600">{app.job_id?.company_name}</span>
                                            {app.job_id?.location_city && (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1 text-slate-300" />
                                                    {app.job_id.location_city}
                                                </div>
                                            )}
                                            <div className="flex items-center font-medium text-sm">
                                                Applied on {formatDate(app)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl md:min-w-[220px] justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`${getStatusColor(app.status)} p-2 rounded-lg`}>
                                            {getStatusIcon(app.status)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                            <p className={`text-sm font-black uppercase ${getStatusColor(app.status).split(' ')[1]}`}>
                                                {app.status || 'applied'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200"></div>
                                    <div className="p-3 bg-white text-slate-400 rounded-xl">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {applications.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start applying to jobs to see your application pipeline here.</p>
                            <Link to="/jobs" className="btn-primary py-3 px-8 inline-block">Browse Jobs</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserApplications;
