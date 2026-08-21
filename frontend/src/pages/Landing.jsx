import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, Zap, Layout, Code2, Smartphone, Cpu, Lightbulb, X, Instagram, Youtube } from 'lucide-react';

import heroBg from '../assets/hero-bg.png';
import recruiterView from '../assets/recruiter-view.png';
import engineeringServices from '../assets/engineering-services.png';

import whatsappLogo from '../assets/contact/whatsapp.png';
import mailLogo from '../assets/contact/mail.png';
import callLogo from '../assets/contact/call.png';
import logo from '../logo-centennial.png';

const Landing = () => {
    const stats = [
        { label: "30 Yrs", sub: "Market Presence", bg: "bg-brand-light" },
        { label: "180+", sub: "Expert Mentors", bg: "bg-brand-blue" },
        { label: "2700+", sub: "Happy Placements", bg: "bg-brand-navy" },
    ];

    const services = [
        { title: "IT Staffing", desc: "Expert talent for your teams.", icon: "👥" },
        { title: "Tech Strategy", desc: "Digital roadmap for success.", icon: "🎯" },
        { title: "App Dev", desc: "Modern web & mobile apps.", icon: "📱" },
        { title: "Cloud Services", desc: "Scalable cloud solutions.", icon: "☁️" },
        { title: "Product Dev", desc: "End-to-end product design.", icon: "🚀" },
        { title: "Consultancy", desc: "Expert business IT advice.", icon: "💡" },
    ];

    const valueProps = [
        { title: "Global Outreach", desc: "Connect with talent and opportunities across the globe with our extensive network.", icon: "🌐" },
        { title: "Pre-Vetted Network", desc: "Every candidate and company is thoroughly vetted to ensure quality and reliability.", icon: "✅" },
        { title: "Rapid Delivery", desc: "Fast-track your hiring or job search with our streamlined, efficient platform.", icon: "⚡" },
    ];

    const testimonials = [
        { name: "Alex Reed", role: "CTO, TechFlow", text: "The quality of talent we found through Centennial is unmatched. They truly understand our tech stack.", stars: 5, img: "https://i.pravatar.cc/150?u=alex" },
        { name: "Sarah Jenkins", role: "HR Director, GlobalInc", text: "Streamlined our entire hiring process. We saved weeks of time and found the perfect fits for our roles.", stars: 5, img: "https://i.pravatar.cc/150?u=sarah" },
        { name: "Thomas Merico", role: "Founder, StartupX", text: "The pre-vetted network is a game changer. Reliable, fast, and high-quality candidates every single time.", stars: 5, img: "https://i.pravatar.cc/150?u=thomas" },
    ];

    return (
        <div className="overflow-x-hidden font-body text-text-main bg-white">
            {/* Hero Section */}
            <section className="pt-32 lg:pt-48 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-navy leading-tight mb-6 tracking-tight">
                            Connect <br />with <span className="text-brand-blue">Elite</span> <br />Talent <br />Instantly.
                        </h1>
                        <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
                            Recruitment agencies directly connect with Elite Solutions. From SMBs to Fortune, we find the highest quality talent for the jobs of the future.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/jobs" className="bg-brand-blue text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-blue/90 transition-all shadow-md text-center inline-block">Explore Careers</Link>
                            <Link to="/auth?mode=signup&role=admin" className="border-2 border-brand-navy text-brand-navy px-8 py-4 rounded-full font-semibold hover:bg-brand-navy hover:text-white transition-all text-center inline-block">Post a Talent</Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img src={heroBg} alt="Elite Talent Network" className="w-full h-auto object-cover" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section statrt here */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={`${stat.bg} ${i === 0 ? "text-brand-navy" : "text-white"} p-10 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg transform hover:-translate-y-2 transition-transform duration-300`}
                        >
                            <span className="text-4xl lg:text-5xl font-extrabold mb-2">{stat.label}</span>
                            <span className="text-sm font-medium opacity-80 uppercase tracking-widest">{stat.sub}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="bg-bg-light py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-brand-blue/20 rounded-3xl blur-2xl group-hover:bg-brand-blue/30 transition-colors"></div>
                        <img src={engineeringServices} alt="Digital Solutions" className="relative z-10 rounded-3xl shadow-2xl" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-4 block">End-to-End Solutions</span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-navy mb-8 leading-tight">
                            Comprehensive solutions for <span className="text-brand-blue">Digital Success</span>
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {services.map((service, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-navy group-hover:text-brand-blue transition-colors">{service.title}</h3>
                                        <p className="text-sm text-text-muted">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Value Propositions */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    {valueProps.map((prop, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="p-8 rounded-3xl border border-gray-100 hover:border-brand-blue hover:shadow-2xl transition-all duration-300 group bg-white"
                        >
                            <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                {prop.icon}
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy mb-4">{prop.title}</h3>
                            <p className="text-text-muted leading-relaxed">{prop.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Pipeline Management */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-brand-navy rounded-[3rem] overflow-hidden grid lg:grid-cols-2 shadow-2xl"
                    >
                        <div className="p-12 lg:p-20 flex flex-col justify-center">
                            <span className="text-brand-light font-bold tracking-widest uppercase text-sm mb-4">Pipeline Management</span>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Stay in control of your <span className="text-brand-light">hiring pipeline</span>
                            </h2>
                            <p className="text-blue-100/70 text-lg mb-10 max-w-md">
                                Managing recruitment has never been easier. Filter, track, and engage talent with our intuitive dashboard built for speed.
                            </p>
                            <div>
                                <Link to="/auth?mode=signup&role=admin" className="inline-block bg-white text-brand-navy px-8 py-4 rounded-full font-bold hover:bg-brand-light hover:text-white transition-colors">
                                    Start Hiring Now
                                </Link>
                            </div>
                        </div>
                        <div className="relative min-h-[400px]">
                            <img src={recruiterView} alt="Hiring Pipeline Dashboard" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy to-transparent lg:hidden"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 lg:py-32 bg-bg-light">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-navy">Loved by teams worldwide</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((test, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className="flex text-yellow-400 mb-6 font-bold text-lg">
                                    {"★".repeat(test.stars)}
                                </div>
                                <p className="text-text-muted italic mb-8 leading-relaxed">"{test.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={test.img} alt={test.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-blue/20" />
                                    <div>
                                        <h4 className="font-bold text-brand-navy">{test.name}</h4>
                                        <p className="text-xs text-text-muted">{test.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto bg-gradient-to-br from-brand-navy to-brand-blue rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl"
                >
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <p className="text-blue-200 font-medium mb-6">Over 2000+ developers and 300+ companies shaping the future with us.</p>
                        <h2 className="text-4xl lg:text-6xl font-extrabold mb-10 leading-tight">Ready to take the next step in your career?</h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/auth?mode=signup" className="inline-block bg-white text-brand-navy px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-light hover:text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                                Get Started For Free
                            </Link>
                            <Link to="/jobs" className="font-bold border-b-2 border-white/30 pb-1 hover:text-brand-light hover:border-brand-light transition-all inline-block">
                                Contact our team →
                            </Link>
                        </div>
                    </div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-light/10 rounded-full blur-2xl"></div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left mb-16">
                        <div>
                            <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
                                <img src={logo} alt="Centennial Infotech Logo" className="h-12 w-auto object-contain" />
                                <span className="text-2xl font-black tracking-tight text-brand-navy">Centennial <span className="text-brand-blue">Talent Solutions</span></span>
                            </div>
                            <p className="text-text-muted max-w-xs font-medium">Empowering the world's best tech teams with intelligent recruitment solutions.</p>
                        </div>

                        <div className="flex flex-wrap gap-12 justify-center md:justify-end">
                            <div className="space-y-4">
                                <h4 className="font-bold text-brand-navy uppercase text-xs tracking-widest">Product</h4>
                                <ul className="text-text-muted space-y-3 text-sm font-semibold">
                                    <li><Link to="/jobs" className="hover:text-brand-blue transition-colors">Find Jobs</Link></li>
                                    <li><Link to="/auth?mode=signup&role=admin" className="hover:text-brand-blue transition-colors">Hire Talent</Link></li>
                                    <li><a href="#" className="hover:text-brand-blue transition-colors">IT Consulting</a></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-brand-navy uppercase text-xs tracking-widest">Contact Us</h4>
                                <ul className="text-text-muted space-y-3 text-sm font-semibold">
                                    <li className="flex items-center group justify-center md:justify-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-bg-light shadow-sm overflow-hidden p-1 group-hover:shadow-md group-hover:bg-white transition-all">
                                            <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-contain" />
                                        </div>
                                        <a href="https://wa.me/918146511568" className="hover:text-brand-blue transition-colors">+91 81465 11568</a>
                                    </li>
                                    <li className="flex items-center group justify-center md:justify-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-bg-light shadow-sm overflow-hidden p-1 group-hover:shadow-md group-hover:bg-white transition-all">
                                            <img src={mailLogo} alt="Mail" className="w-full h-full object-contain" />
                                        </div>
                                        <a href="mailto:support@centennialtalent.com" className="hover:text-brand-blue transition-colors">support@centennialtalent.com</a>
                                    </li>
                                    <li className="flex items-center group justify-center md:justify-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-bg-light shadow-sm overflow-hidden p-1 group-hover:shadow-md group-hover:bg-white transition-all">
                                            <img src={callLogo} alt="Call" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <a href="tel:+9101723596492" className="hover:text-brand-blue transition-colors">+91-01723596492</a>
                                            <a href="tel:+918146511568" className="hover:text-brand-blue transition-colors">+91-81465 11568</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-text-muted text-xs font-bold gap-4">
                        <p>© 2026 Centennial Talent Solutions. Connecting talent to the future</p>
                        <div className="flex items-center space-x-6">
                            <a href="https://x.com/centennialits" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-brand-navy transition-colors">
                                <X className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/cententialinfotech" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-brand-navy transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.youtube.com/@centennialinfotech" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-brand-navy transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
