import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logo from '../logo-centennial.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        // Preserve all persistent local database keys dynamically (starts with local_ or resume_data_url)
        const preserved = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('local_') || key === 'resume_data_url')) {
                preserved[key] = localStorage.getItem(key);
            }
        }
        localStorage.clear();
        Object.entries(preserved).forEach(([k, v]) => localStorage.setItem(k, v));
        navigate('/auth');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="Centennial Infotech Logo" className="h-10 sm:h-12 w-auto object-contain" />
                        <span className="text-xl font-bold text-brand-navy hidden sm:block">Centennial <span className="text-brand-blue">Talent Solutions</span></span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue'}`}>Home</Link>
                    <Link to="/jobs" className={`text-sm font-medium transition-colors ${location.pathname === '/jobs' ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue'}`}>Find jobs</Link>

                    {token ? (
                        <div className="flex items-center gap-6">
                            {role === 'admin' ? (
                                <>
                                    <Link to="/admin/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/admin/dashboard' ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue'}`}>Admin</Link>
                                    <Link to="/admin/candidates" className={`text-sm font-medium transition-colors ${location.pathname === '/admin/candidates' ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue'}`}>All Candidates</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" className={`text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue'}`}>Profile</Link>
                                    <Link to="/applications" className={`text-sm font-medium transition-colors ${location.pathname === '/applications' ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue'}`}>Applications</Link>
                                </>
                            )}
                            <div className="h-4 w-[1px] bg-gray-200" />
                            <button onClick={handleLogout} className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth" className="text-sm font-medium text-text-muted hover:text-brand-blue transition-colors">Login</Link>
                            <Link to="/auth?mode=signup" className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-blue transition-all shadow-md">Join Now</Link>
                        </>
                    )}
                </div>

                <button
                    className="md:hidden p-2 text-brand-navy"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            <div className={`md:hidden bg-white border-b border-gray-100 px-6 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-4">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">Home</Link>
                    <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">Find jobs</Link>
                    {token ? (
                        <>
                            {role === 'admin' ? (
                                <>
                                    <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">Admin</Link>
                                    <Link to="/admin/candidates" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">All Candidates</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">Profile</Link>
                                    <Link to="/applications" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">Applications</Link>
                                </>
                            )}
                            <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="text-sm font-medium text-red-500 text-left">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-text-muted">Login</Link>
                            <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)} className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold w-full text-center hover:bg-brand-blue">Join Now</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
