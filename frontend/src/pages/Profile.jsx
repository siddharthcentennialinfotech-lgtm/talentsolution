import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    User, Mail, Phone, MapPin, Building, GraduationCap,
    Calendar, Save, Loader2, CheckCircle2, Plus, X,
    Briefcase, Award, Linkedin, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileField = ({ label, icon: Icon, name, value, onChange, placeholder, type = "text", disabled = false }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-300">
                {Icon && <Icon className="w-4 h-4" />}
            </div>
            <input
                name={name}
                type={type}
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 ${Icon ? 'pl-11' : 'px-6'} pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-bold text-slate-700 disabled:opacity-50`}
            />
        </div>
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{title}</h2>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
    </div>
);

const Profile = () => {
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location_city: '',
        degree: '',
        branch: '',
        specialization: '',
        university: '',
        graduation_year: '',
        experience_years: 0,
        current_company: '',
        linkedin_url: '',
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/user/profile');
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (Number(profile.experience_years) > 50) {
            setNotification({ type: 'error', text: 'Experience cannot exceed 50 years' });
            return;
        }
        if (Number(profile.experience_years) < 0) {
            setNotification({ type: 'error', text: 'Experience cannot be negative' });
            return;
        }
        setSaving(true);
        setNotification(null);
        try {
            await api.put('/auth/user/profile', profile);
            setNotification({ type: 'success', text: 'Profile intelligence updated!' });
            setTimeout(() => setNotification(null), 4000);
        } catch (err) {
            setNotification({ type: 'error', text: err.response?.data?.message || 'Synchronization failed' });
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Calibrating Experience...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[3rem] p-8 md:p-12 mb-12 shadow-premium flex flex-col md:flex-row items-center gap-10 border border-white/50"
                >
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-600 to-accent-blue rounded-[2.5rem] flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-glow transform transition-transform group-hover:scale-105 duration-500">
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary-600 border border-slate-100">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary-50 rounded-full text-primary-700 text-[10px] font-black uppercase tracking-widest mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                            <span>Elite Member Profile</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
                            {profile.first_name} <span className="text-primary-600">{profile.last_name}</span>
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-sm">
                            <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {profile.email}</div>
                            <div className="hidden md:block w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {profile.location_city || 'Digital Nomad'}</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-premium btn-premium-primary !px-8 !py-4 flex items-center justify-center gap-3 shadow-glow"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>Sync Changes</span></>}
                        </button>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12 text-left">
                    {/* Sidebar: Status & Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-12"
                    >
                        <div className="glass rounded-[2.5rem] p-10 shadow-premium border border-white/50">
                            <SectionHeader icon={Award} title="Core Intelligence" subtitle="Professional Stack" />

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Technical Skills</label>
                                    <div className="flex flex-wrap gap-2.5 mb-6">
                                        <AnimatePresence>
                                            {profile.skills.map((skill, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="px-4 py-2 bg-white border border-slate-100 text-slate-700 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm group hover:border-primary-200 transition-colors"
                                                >
                                                    {skill}
                                                    <X
                                                        className="w-3.5 h-3.5 cursor-pointer text-slate-300 hover:text-red-500 transition-colors"
                                                        onClick={() => removeSkill(skill)}
                                                    />
                                                </motion.span>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-6 pr-14 outline-none focus:border-primary-500 font-bold text-sm transition-all text-left"
                                            placeholder="Add a power skill..."
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="absolute right-3 top-2 w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 text-left">
                                    <ProfileField
                                        label="LinkedIn Identifier"
                                        icon={Linkedin}
                                        name="linkedin_url"
                                        value={profile.linkedin_url}
                                        onChange={handleChange}
                                        placeholder="linkedin.com/in/..."
                                    />
                                    {profile.linkedin_url && (
                                        <motion.a
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[#0077b5] hover:bg-[#006699] text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] group"
                                        >
                                            <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span>Visit Account</span>
                                            <ExternalLink className="w-4 h-4 opacity-70" />
                                        </motion.a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl"></div>
                            <h3 className="text-xl font-black mb-8 relative z-10">Verification Status</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Email Identity</span>
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Expertise Rating</span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-accent-cyan font-black text-[10px]">PREMIUM</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Form: Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-12"
                    >
                        {/* Profile Sync Notification */}
                        <AnimatePresence>
                            {notification && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-6 rounded-[2rem] flex items-center gap-4 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                                >
                                    {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                    <span className="font-black tracking-tight">{notification.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="glass rounded-[3rem] p-10 md:p-14 shadow-premium border border-white/50 space-y-16">
                            {/* Identity Section */}
                            <section>
                                <SectionHeader icon={User} title="Personnel File" subtitle="Legal & Contact Identification" />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ProfileField label="First Name" name="first_name" value={profile.first_name} onChange={handleChange} />
                                    <ProfileField label="Last Name" name="last_name" value={profile.last_name} onChange={handleChange} />
                                    <ProfileField label="Direct Phone" icon={Phone} name="phone" value={profile.phone} onChange={handleChange} placeholder="+91..." />
                                    <ProfileField label="Current Headquarters" icon={MapPin} name="location_city" value={profile.location_city} onChange={handleChange} placeholder="City, Country" />
                                </div>
                            </section>

                            {/* Education Section */}
                            <section>
                                <SectionHeader icon={GraduationCap} title="Academic Foundation" subtitle="Educational Background & Branch" />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <ProfileField label="Primary Institution" icon={Building} name="university" value={profile.university} onChange={handleChange} placeholder="Massachusetts Institute of Technology" />
                                    </div>
                                    <ProfileField label="Degree Earned" name="degree" value={profile.degree} onChange={handleChange} placeholder="e.g. Bachelor of Engineering" />
                                    <ProfileField label="Branch / Department" name="branch" value={profile.branch} onChange={handleChange} placeholder="e.g. Computer Science & Engineering" />
                                    <ProfileField label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} placeholder="e.g. Software Systems" />
                                    <ProfileField label="Passing Cycle" icon={Calendar} name="graduation_year" type="number" value={profile.graduation_year} onChange={handleChange} placeholder="2024" />
                                </div>
                            </section>

                            {/* Career Section */}
                            <section>
                                <SectionHeader icon={Briefcase} title="Professional Trajectory" subtitle="Work Experience & Impact" />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ProfileField label="Industry Tenure (Years)" name="experience_years" type="number" value={profile.experience_years} onChange={handleChange} />
                                    <ProfileField label="Current Organization" icon={Building} name="current_company" value={profile.current_company} onChange={handleChange} placeholder="Hyperion Tech Inc." />
                                </div>
                            </section>

                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
