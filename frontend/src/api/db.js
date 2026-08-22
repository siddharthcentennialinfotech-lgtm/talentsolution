/**
 * =====================================================================
 * FRONTEND DATABASE SERVICE (db.js)
 * =====================================================================
 * PRIMARY:   Browser localStorage (instant, always available, persistent)
 * SECONDARY: MongoDB via backend REST API (sync when backend available)
 *
 * All credentials embedded — no .env needed:
 *   JWT_SECRET:            supersecretkey12345
 *   Cloudinary cloud:      dnvxdg8jp
 *   Cloudinary key:        676669881499328
 *   Cloudinary secret:     PXkXEFKlYzPrhSH_5Gcj9WQoArM
 *   MongoDB URI:           embedded in backend db.js
 * =====================================================================
 */

// ─── EMBEDDED CONFIG ────────────────────────────────────────────────
const CONFIG = {
  JWT_SECRET: 'supersecretkey12345',
  BACKEND_URL: (() => {
    const env = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_URL : null;
    if (env && env.trim()) return env.trim();
    return '/api';
  })(),
  CLOUDINARY: {
    cloud_name: 'dnvxdg8jp',
    api_key: '676669881499328',
    upload_preset: 'ml_default',
    upload_url: 'https://api.cloudinary.com/v1_1/dnvxdg8jp/auto/upload'
  }
};

// ─── STORAGE KEYS ───────────────────────────────────────────────────
const KEYS = {
  JOBS: 'local_jobs',
  APPS: 'local_applications',
  USERS: 'local_users',
  PROFILE: 'local_profile',
  CATEGORIES: 'local_categories',
  MAX_SLOTS: 'local_max_slots',
  TOKEN: 'token',
  ROLE: 'role',
  USER_ID: 'userId',
  USER_NAME: 'userName',
  USER_EMAIL: 'userEmail',
};

// ─── LOW-LEVEL STORAGE HELPERS ──────────────────────────────────────
const store = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      if (val === null) return fallback;
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[DB] localStorage write failed:', e);
    }
  },
  raw: (key) => localStorage.getItem(key),
  rawSet: (key, val) => localStorage.setItem(key, val),
};

// ─── ID GENERATOR ───────────────────────────────────────────────────
const genId = (prefix = 'id') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ─── BACKEND SYNC (fire-and-forget — never blocks UI) ───────────────
const syncToBackend = async (method, path, data = null) => {
  try {
    const token = localStorage.getItem(KEYS.TOKEN);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (data && method !== 'GET') opts.body = JSON.stringify(data);
    const res = await fetch(`${CONFIG.BACKEND_URL}${path}`, opts);
    if (res.ok) return await res.json();
  } catch {
    // Backend offline — silently ignored, localStorage handles it
  }
  return null;
};

// ─── CLOUDINARY UPLOAD (direct from browser) ────────────────────────
export const uploadFileToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CONFIG.CLOUDINARY.upload_preset);
    formData.append('folder', 'resumes');
    const res = await fetch(CONFIG.CLOUDINARY.upload_url, { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) return { url: data.secure_url, public_id: data.public_id };
    }
  } catch (e) {
    console.warn('[DB] Cloudinary direct upload failed, using base64 fallback:', e);
  }
  // Fallback: store as Base64 DataURL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      localStorage.setItem('resume_data_url', dataUrl);
      resolve({ url: dataUrl, public_id: `local_resume_${Date.now()}` });
    };
    reader.readAsDataURL(file);
  });
};

// ════════════════════════════════════════════════════════════════════
//  AUTH SERVICE
// ════════════════════════════════════════════════════════════════════
export const AuthService = {
  register: async ({ first_name, last_name, email, phone, password, role = 'user' }) => {
    const users = store.get(KEYS.USERS, []);
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists with this email address.');
    }
    const newUser = {
      _id: genId('user'), first_name, last_name, email,
      phone: String(phone || '').replace(/\D/g, '').slice(0, 10),
      role, password, createdAt: new Date().toISOString()
    };
    users.push(newUser);
    store.set(KEYS.USERS, users);
    // Initialize blank profile
    if (role === 'user') {
      const ep = store.get(KEYS.PROFILE, {});
      if (!ep.email) {
        store.set(KEYS.PROFILE, {
          first_name, last_name, email,
          phone: String(phone || ''),
          location_city: '', location_state: '',
          degree: '', branch: '', university: '',
          experience_years: 0, current_company: '',
          resume_url: '', skills: []
        });
      }
    }
    const token = 'mock_jwt_token_demo';
    localStorage.setItem(KEYS.TOKEN, token);
    localStorage.setItem(KEYS.ROLE, role);
    localStorage.setItem(KEYS.USER_ID, newUser._id);
    localStorage.setItem(KEYS.USER_NAME, `${first_name} ${last_name}`);
    localStorage.setItem(KEYS.USER_EMAIL, email);
    // Non-blocking backend sync
    syncToBackend('POST', '/auth/register', { first_name, last_name, email, phone, password, role })
      .then(res => { if (res?.token) localStorage.setItem(KEYS.TOKEN, res.token); });
    return { user: newUser, token };
  },

  login: async ({ email, password, role = 'user' }) => {
    // Try backend first for a real JWT
    const backendRes = await syncToBackend('POST',
      role === 'admin' ? '/auth/admin/login' : '/auth/login',
      { email, password }
    );
    if (backendRes?.token) {
      const user = backendRes.user;
      localStorage.setItem(KEYS.TOKEN, backendRes.token);
      localStorage.setItem(KEYS.ROLE, user?.role || role);
      localStorage.setItem(KEYS.USER_ID, user?._id || genId('user'));
      localStorage.setItem(KEYS.USER_NAME, `${user?.first_name || ''} ${user?.last_name || ''}`.trim());
      localStorage.setItem(KEYS.USER_EMAIL, email);
      if (user?.role !== 'admin') {
        const profile = store.get(KEYS.PROFILE, {});
        store.set(KEYS.PROFILE, { ...profile, ...user, email });
      }
      return { user, token: backendRes.token };
    }
    // Fallback: localStorage
    const users = store.get(KEYS.USERS, []);
    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        _id: genId('user'),
        first_name: email.split('@')[0], last_name: '',
        email, role, createdAt: new Date().toISOString()
      };
      users.push(user);
      store.set(KEYS.USERS, users);
    }
    const token = 'mock_jwt_token_demo';
    localStorage.setItem(KEYS.TOKEN, token);
    localStorage.setItem(KEYS.ROLE, user.role || role);
    localStorage.setItem(KEYS.USER_ID, user._id);
    localStorage.setItem(KEYS.USER_NAME, `${user.first_name || ''} ${user.last_name || ''}`.trim());
    localStorage.setItem(KEYS.USER_EMAIL, email);
    return { user, token };
  },

  logout: (navigate) => {
    const preserve = [KEYS.JOBS, KEYS.APPS, KEYS.USERS, KEYS.PROFILE, KEYS.CATEGORIES, KEYS.MAX_SLOTS];
    const saved = {};
    preserve.forEach(k => { const v = localStorage.getItem(k); if (v) saved[k] = v; });
    localStorage.clear();
    Object.entries(saved).forEach(([k, v]) => localStorage.setItem(k, v));
    if (navigate) navigate('/auth');
  },

  getCurrentUser: () => ({
    _id: localStorage.getItem(KEYS.USER_ID),
    role: localStorage.getItem(KEYS.ROLE),
    email: localStorage.getItem(KEYS.USER_EMAIL),
    name: localStorage.getItem(KEYS.USER_NAME),
    token: localStorage.getItem(KEYS.TOKEN),
  }),

  isLoggedIn: () => !!localStorage.getItem(KEYS.TOKEN),
  isAdmin: () => localStorage.getItem(KEYS.ROLE) === 'admin',
};

// ════════════════════════════════════════════════════════════════════
//  PROFILE SERVICE
// ════════════════════════════════════════════════════════════════════
export const ProfileService = {
  get: async () => {
    const remote = await syncToBackend('GET', '/auth/user/profile');
    if (remote && remote.email) {
      const local = store.get(KEYS.PROFILE, {});
      const merged = { ...local, ...remote };
      store.set(KEYS.PROFILE, merged);
      return merged;
    }
    return store.get(KEYS.PROFILE, {});
  },
  update: async (data) => {
    const current = store.get(KEYS.PROFILE, {});
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    store.set(KEYS.PROFILE, updated);
    syncToBackend('PUT', '/auth/user/update-profile', data);
    const email = updated.email || localStorage.getItem(KEYS.USER_EMAIL);
    if (email) {
      const users = store.get(KEYS.USERS, []);
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) { users[idx] = { ...users[idx], ...data }; store.set(KEYS.USERS, users); }
    }
    return { user: updated };
  },
  updateResumeUrl: (url) => {
    const profile = store.get(KEYS.PROFILE, {});
    profile.resume_url = url;
    store.set(KEYS.PROFILE, profile);
    syncToBackend('PUT', '/auth/user/update-profile', { resume_url: url });
  }
};

// ════════════════════════════════════════════════════════════════════
//  JOBS SERVICE
// ════════════════════════════════════════════════════════════════════
export const JobsService = {
  getAll: async (filters = {}) => {
    // Pull remote and merge
    const remote = await syncToBackend('GET', `/jobs${filters.keyword ? `?keyword=${filters.keyword}` : ''}`);
    if (remote && Array.isArray(remote) && remote.length > 0) {
      const local = store.get(KEYS.JOBS, []);
      const localIds = new Set(local.map(j => j._id));
      const merged = [...local, ...remote.filter(j => !localIds.has(j._id))];
      store.set(KEYS.JOBS, merged);
    }
    let list = store.get(KEYS.JOBS, []);
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(j => j.title?.toLowerCase().includes(kw) || j.company_name?.toLowerCase().includes(kw) || j.role?.toLowerCase().includes(kw));
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      list = list.filter(j => j.location_city?.toLowerCase().includes(loc) || j.location_state?.toLowerCase().includes(loc));
    }
    if (filters.job_type) list = list.filter(j => j.job_type === filters.job_type);
    if (filters.role) list = list.filter(j => j.role === filters.role);
    return list;
  },

  getById: async (id) => {
    const remote = await syncToBackend('GET', `/jobs/${id}`);
    if (remote && (remote._id || remote.title)) {
      const list = store.get(KEYS.JOBS, []);
      const idx = list.findIndex(j => j._id === id || j.job_id === id);
      if (idx !== -1) { list[idx] = { ...list[idx], ...remote }; store.set(KEYS.JOBS, list); }
      else { list.unshift(remote); store.set(KEYS.JOBS, list); }
      return remote;
    }
    const list = store.get(KEYS.JOBS, []);
    return list.find(j => j._id === id || j.job_id === id) || list[0];
  },

  getAdminAll: async () => {
    const remote = await syncToBackend('GET', '/jobs/admin/all');
    const localJobs = store.get(KEYS.JOBS, []);
    if (remote && Array.isArray(remote) && remote.length > 0) {
      const localIds = new Set(localJobs.map(j => j._id));
      const merged = [...localJobs, ...remote.filter(j => !localIds.has(j._id))];
      store.set(KEYS.JOBS, merged);
      return merged;
    }
    const apps = store.get(KEYS.APPS, []);
    return localJobs.map(j => ({
      ...j,
      applicationCount: apps.filter(a => {
        const aJobId = typeof a.job_id === 'object' ? a.job_id?._id : a.job_id;
        return aJobId === j._id || aJobId === j.job_id;
      }).length
    }));
  },

  getStats: async () => {
    const remote = await syncToBackend('GET', '/jobs/admin/stats');
    const list = store.get(KEYS.JOBS, []);
    const apps = store.get(KEYS.APPS, []);
    const maxSlots = parseInt(localStorage.getItem(KEYS.MAX_SLOTS) || '3');
    return {
      totalJobs: remote?.totalJobs ?? list.length,
      totalApplications: remote?.totalApplications ?? apps.length,
      activeJobs: remote?.activeJobs ?? list.filter(j => j.status === 'open').length,
      maxJobsAllowed: remote?.maxJobsAllowed ?? maxSlots,
      purchased_slots: remote?.purchased_slots ?? Math.max(0, maxSlots - 3),
    };
  },

  create: async (data) => {
    const newJob = {
      _id: genId('job'),
      job_id: data.job_id || `JOB${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open', createdAt: new Date().toISOString(), ...data
    };
    const list = store.get(KEYS.JOBS, []);
    list.unshift(newJob);
    store.set(KEYS.JOBS, list);
    const backendJob = await syncToBackend('POST', '/jobs', data);
    if (backendJob?._id) {
      const updated = store.get(KEYS.JOBS, []);
      const idx = updated.findIndex(j => j._id === newJob._id);
      if (idx !== -1) { updated[idx]._id = backendJob._id; store.set(KEYS.JOBS, updated); }
    }
    return newJob;
  },

  update: async (id, data) => {
    const list = store.get(KEYS.JOBS, []);
    const idx = list.findIndex(j => j._id === id || j.job_id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      store.set(KEYS.JOBS, list);
      syncToBackend('PUT', `/jobs/${id}`, data);
      return list[idx];
    }
    throw new Error('Job not found');
  },

  delete: async (id) => {
    let list = store.get(KEYS.JOBS, []);
    list = list.filter(j => j._id !== id && j.job_id !== id);
    store.set(KEYS.JOBS, list);
    syncToBackend('DELETE', `/jobs/${id}`);
    return { success: true };
  },

  getCategories: async () => {
    const localCats = store.get(KEYS.CATEGORIES, []);
    const jobs = store.get(KEYS.JOBS, []);
    const roleNames = Array.from(new Set(jobs.map(j => j.role).filter(Boolean)));
    const catNames = localCats.map(c => c.name);
    return Array.from(new Set([...roleNames, ...catNames])).map(name => ({ name }));
  },

  addCategory: async (name) => {
    const cats = store.get(KEYS.CATEGORIES, []);
    const newCat = { _id: genId('cat'), name };
    cats.push(newCat);
    store.set(KEYS.CATEGORIES, cats);
    syncToBackend('POST', '/jobs/categories/add', { name });
    return newCat;
  },

  deleteCategory: async (id) => {
    let cats = store.get(KEYS.CATEGORIES, []);
    cats = cats.filter(c => c._id !== id && c.name !== id);
    store.set(KEYS.CATEGORIES, cats);
    syncToBackend('DELETE', `/jobs/categories/${id}`);
    return { success: true };
  }
};

// ════════════════════════════════════════════════════════════════════
//  APPLICATIONS SERVICE
// ════════════════════════════════════════════════════════════════════
export const ApplicationsService = {
  apply: async ({ job_id, cover_letter, resume_url }) => {
    const profile = store.get(KEYS.PROFILE, {});
    const userEmail = profile.email || localStorage.getItem(KEYS.USER_EMAIL) || '';
    const apps = store.get(KEYS.APPS, []);
    const alreadyApplied = apps.find(a => {
      const aJobId = typeof a.job_id === 'object' ? a.job_id?._id : a.job_id;
      return aJobId === job_id && (a.user_id?.email === userEmail || a.user_email === userEmail);
    });
    if (alreadyApplied) throw new Error('You have already applied to this job.');
    const newApp = {
      _id: genId('app'), job_id, user_id: profile, user_email: userEmail,
      cover_letter, resume_url: resume_url || profile.resume_url || '',
      status: 'applied', createdAt: new Date().toISOString()
    };
    apps.unshift(newApp);
    store.set(KEYS.APPS, apps);
    // Sync to backend
    const backendApp = await syncToBackend('POST', '/applications', { job_id, cover_letter, resume_url });
    if (backendApp?._id) {
      const updated = store.get(KEYS.APPS, []);
      const idx = updated.findIndex(a => a._id === newApp._id);
      if (idx !== -1) { updated[idx]._id = backendApp._id; store.set(KEYS.APPS, updated); }
    }
    return newApp;
  },

  getMyApplications: async () => {
    const remote = await syncToBackend('GET', '/applications/my/all');
    if (remote && Array.isArray(remote) && remote.length > 0) {
      const local = store.get(KEYS.APPS, []);
      const localIds = new Set(local.map(a => a._id));
      store.set(KEYS.APPS, [...local, ...remote.filter(a => !localIds.has(a._id))]);
    }
    const apps = store.get(KEYS.APPS, []);
    const jobs = store.get(KEYS.JOBS, []);
    const userEmail = store.get(KEYS.PROFILE, {}).email || localStorage.getItem(KEYS.USER_EMAIL);
    const myApps = apps.filter(a => !a.is_deleted_by_recruiter && (
      a.user_id?.email === userEmail || a.user_email === userEmail
    ));
    return myApps.map(a => {
      const aJobId = typeof a.job_id === 'object' ? a.job_id?._id : a.job_id;
      const matchedJob = jobs.find(j => j._id === aJobId || j.job_id === aJobId) || (typeof a.job_id === 'object' ? a.job_id : jobs[0]);
      return { ...a, job_id: matchedJob };
    });
  },

  getForJob: async (jobId) => {
    const remote = await syncToBackend('GET', `/applications/job/${jobId}`);
    const apps = store.get(KEYS.APPS, []);
    if (remote && Array.isArray(remote)) {
      const localIds = new Set(apps.map(a => a._id));
      store.set(KEYS.APPS, [...apps, ...remote.filter(a => !localIds.has(a._id))]);
      return remote;
    }
    return apps.filter(a => {
      const aJobId = typeof a.job_id === 'object' ? a.job_id?._id : a.job_id;
      return aJobId === jobId && !a.is_deleted_by_recruiter;
    });
  },

  getAllCandidates: async ({ page = 1, limit = 20, search = '', status = '' } = {}) => {
    const remote = await syncToBackend('GET', `/applications/admin/candidates?page=${page}&limit=${limit}&search=${search}&status=${status}`);
    const jobs = store.get(KEYS.JOBS, []);
    if (remote?.data && Array.isArray(remote.data)) {
      const local = store.get(KEYS.APPS, []);
      const localIds = new Set(local.map(a => a._id));
      store.set(KEYS.APPS, [...local, ...remote.data.filter(a => !localIds.has(a._id))]);
      return remote;
    }
    let apps = store.get(KEYS.APPS, []).filter(a => !a.is_deleted_by_recruiter);
    if (search) {
      const s = search.toLowerCase();
      apps = apps.filter(a => a.user_id?.first_name?.toLowerCase().includes(s) || a.user_id?.email?.toLowerCase().includes(s) || a.user_email?.toLowerCase().includes(s));
    }
    if (status) apps = apps.filter(a => a.status === status);
    const populated = apps.map(a => {
      const aJobId = typeof a.job_id === 'object' ? a.job_id?._id : a.job_id;
      const matchedJob = jobs.find(j => j._id === aJobId || j.job_id === aJobId) || jobs[0];
      return { ...a, job_id: matchedJob };
    });
    return { success: true, count: populated.length, total: populated.length, page: 1, pages: 1, data: populated };
  },

  updateStatus: async (appId, status) => {
    const apps = store.get(KEYS.APPS, []);
    const idx = apps.findIndex(a => a._id === appId);
    if (idx !== -1) { apps[idx].status = status; apps[idx].updatedAt = new Date().toISOString(); store.set(KEYS.APPS, apps); }
    syncToBackend('PUT', `/applications/${appId}/status`, { status });
    return apps[idx] || { _id: appId, status };
  },

  delete: async (appId) => {
    const apps = store.get(KEYS.APPS, []);
    const idx = apps.findIndex(a => a._id === appId);
    if (idx !== -1) { apps[idx].is_deleted_by_recruiter = true; store.set(KEYS.APPS, apps); }
    syncToBackend('DELETE', `/applications/${appId}`);
    return { success: true };
  },

  getById: async (appId) => {
    const remote = await syncToBackend('GET', `/applications/${appId}`);
    if (remote?._id) return remote;
    const apps = store.get(KEYS.APPS, []);
    const jobs = store.get(KEYS.JOBS, []);
    const app = apps.find(a => a._id === appId);
    if (app) {
      const aJobId = typeof app.job_id === 'object' ? app.job_id?._id : app.job_id;
      const matchedJob = jobs.find(j => j._id === aJobId || j.job_id === aJobId) || jobs[0];
      return { ...app, job_id: matchedJob };
    }
    return null;
  }
};

// ════════════════════════════════════════════════════════════════════
//  PAYMENT SERVICE
// ════════════════════════════════════════════════════════════════════
export const PaymentService = {
  captureSandbox: async (slots = 1) => {
    const maxSlots = parseInt(localStorage.getItem(KEYS.MAX_SLOTS) || '3');
    const newSlots = maxSlots + slots;
    localStorage.setItem(KEYS.MAX_SLOTS, String(newSlots));
    syncToBackend('POST', '/payment/capture-sandbox', { slots });
    return { success: true, message: `Added ${slots} listing slots.`, maxJobsAllowed: newSlots, purchased_slots: newSlots - 3 };
  },

  createRazorpayOrder: async (slots = 1) => {
    const remote = await syncToBackend('POST', '/payment/create-razorpay-order', { slots });
    if (remote?.id) return remote;
    return { id: `rzp_order_${Date.now()}`, currency: 'INR', amount: slots * 49900, slots };
  },

  verifyRazorpay: async (paymentData) => {
    const remote = await syncToBackend('POST', '/payment/verify-razorpay', paymentData);
    const maxSlots = parseInt(localStorage.getItem(KEYS.MAX_SLOTS) || '3');
    const newSlots = maxSlots + (paymentData.slots || 1);
    localStorage.setItem(KEYS.MAX_SLOTS, String(newSlots));
    return remote || { success: true, maxJobsAllowed: newSlots };
  },

  createPaypalOrder: async (slots = 1) => {
    const remote = await syncToBackend('POST', '/payment/create-paypal-order', { slots });
    if (remote?.orderID) return remote;
    return { orderID: `paypal_${Date.now()}`, slots };
  },

  capturePaypal: async (orderID, slots = 1) => {
    const remote = await syncToBackend('POST', '/payment/capture-paypal', { orderID, slots });
    const maxSlots = parseInt(localStorage.getItem(KEYS.MAX_SLOTS) || '3');
    localStorage.setItem(KEYS.MAX_SLOTS, String(maxSlots + slots));
    return remote || { success: true, maxJobsAllowed: maxSlots + slots };
  }
};

// ════════════════════════════════════════════════════════════════════
//  DATABASE INIT (call once on app startup)
// ════════════════════════════════════════════════════════════════════
const DEFAULT_JOBS = [
  { _id: '650000000000000000000101', job_id: 'job_fullstack_01', title: 'Senior Full Stack Software Engineer', role: 'Software Development', company_name: 'Centennial Tech Solutions', description: 'Building scalable enterprise cloud applications, web portals, and microservices architecture using Node.js, React, and GraphQL.', requirements: '3+ years experience with Node.js & React\nSolid understanding of REST APIs and MongoDB\nExperience with TypeScript & Cloud deployments', responsibilities: 'Architect robust frontend and backend services\nCollaborate with product managers and UI designers\nOptimize application performance and database queries', salary_min: 900000, salary_max: 1800000, currency: 'INR', experience_required: 3, job_type: 'full-time', work_mode: 'hybrid', location_city: 'Bangalore', location_state: 'Karnataka', country: 'India', openings_count: 5, status: 'open', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '650000000000000000000102', job_id: 'job_uiux_02', title: 'UI/UX Product Designer & Developer', role: 'UI/UX Design', company_name: 'Hyperion Innovations', description: 'Designing intuitive design systems, mobile apps, and modern responsive interfaces for high-growth tech platforms.', requirements: 'Proficiency in Figma and Adobe XD\nStrong understanding of responsive HTML/CSS\nPortfolio demonstrating end-to-end UX research', responsibilities: 'Create wireframes, user flows, and interactive prototypes\nConduct user testing and iterate based on user feedback\nMaintain design system tokens and component libraries', salary_min: 600000, salary_max: 1400000, currency: 'INR', experience_required: 2, job_type: 'full-time', work_mode: 'remote', location_city: 'Mumbai', location_state: 'Maharashtra', country: 'India', openings_count: 4, status: 'open', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { _id: '650000000000000000000103', job_id: 'job_qa_03', title: 'Lead QA Automation Engineer', role: 'Quality Assurance', company_name: 'Centennial Infotech', description: 'Automating regression suites, API testing, and ensuring product reliability across web and mobile platforms.', requirements: '4+ years in automated software testing\nExperience with Cypress, Playwright, or Selenium\nStrong API testing skills with Postman & Jest', responsibilities: 'Develop end-to-end automated test suites\nIdentify bugs and work with developers to resolve issues\nImplement CI/CD pipeline test integrations', salary_min: 700000, salary_max: 1300000, currency: 'INR', experience_required: 4, job_type: 'full-time', work_mode: 'onsite', location_city: 'Delhi', location_state: 'Delhi', country: 'India', openings_count: 3, status: 'open', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { _id: '650000000000000000000104', job_id: 'job_devops_04', title: 'DevOps & Cloud Infrastructure Engineer', role: 'IT Consulting', company_name: 'Apex Cloud Systems', description: 'Managing AWS infrastructure, Docker containers, Kubernetes clusters, and automated deployment pipelines.', requirements: 'Experience with AWS services (EC2, S3, ECS, EKS)\nProficiency in Terraform, Docker, & Kubernetes\nStrong Bash/Python scripting abilities', responsibilities: 'Monitor system uptime and security compliance\nAutomate CI/CD pipelines for zero-downtime releases\nOptimize cloud server costs and resource usage', salary_min: 1000000, salary_max: 2000000, currency: 'INR', experience_required: 4, job_type: 'full-time', work_mode: 'hybrid', location_city: 'Hyderabad', location_state: 'Telangana', country: 'India', openings_count: 6, status: 'open', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { _id: '650000000000000000000105', job_id: 'job_ds_05', title: 'Data Scientist & ML Engineer', role: 'Data Science', company_name: 'Neuron Analytics', description: 'Building predictive ML models, NLP pipelines, and data visualization dashboards for enterprise clients.', requirements: 'Strong Python skills with Pandas, NumPy, Scikit-learn\nExperience with TensorFlow or PyTorch\nData visualization with Plotly or Tableau', responsibilities: 'Train and deploy machine learning models\nAnalyze large datasets to derive business insights\nCollaborate with data engineers on ETL pipelines', salary_min: 1200000, salary_max: 2400000, currency: 'INR', experience_required: 3, job_type: 'full-time', work_mode: 'hybrid', location_city: 'Pune', location_state: 'Maharashtra', country: 'India', openings_count: 2, status: 'open', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

export const initDatabase = () => {
  if (!localStorage.getItem(KEYS.JOBS)) store.set(KEYS.JOBS, DEFAULT_JOBS);
  if (!localStorage.getItem(KEYS.APPS)) store.set(KEYS.APPS, []);
  if (!localStorage.getItem(KEYS.USERS)) store.set(KEYS.USERS, []);
  if (!localStorage.getItem(KEYS.MAX_SLOTS)) localStorage.setItem(KEYS.MAX_SLOTS, '3');
  if (!localStorage.getItem(KEYS.PROFILE)) {
    store.set(KEYS.PROFILE, {
      first_name: '', last_name: '',
      email: localStorage.getItem(KEYS.USER_EMAIL) || '',
      phone: '', location_city: '', location_state: '',
      degree: '', branch: '', university: '',
      experience_years: 0, current_company: '',
      resume_url: '', skills: []
    });
  }
};

// ─── DEFAULT EXPORT ──────────────────────────────────────────────────
const DB = {
  Auth: AuthService,
  Profile: ProfileService,
  Jobs: JobsService,
  Applications: ApplicationsService,
  Payment: PaymentService,
  upload: uploadFileToCloudinary,
  init: initDatabase,
  config: CONFIG,
  store,
};

export default DB;
