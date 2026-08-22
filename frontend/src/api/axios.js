import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  return '/api';
};

const defaultJobs = [
  {
    _id: '650000000000000000000101',
    job_id: 'job_fullstack_01',
    title: 'Senior Full Stack Software Engineer',
    role: 'Software Development',
    company_name: 'Centennial Tech Solutions',
    description: 'Building scalable enterprise cloud applications, web portals, and microservices architecture using Node.js, React, and GraphQL.',
    requirements: '3+ years experience with Node.js & React\nSolid understanding of REST APIs and MongoDB\nExperience with TypeScript & Cloud deployments',
    responsibilities: 'Architect robust frontend and backend services\nCollaborate with product managers and UI designers\nOptimize application performance and database queries',
    salary_min: 900000,
    salary_max: 1800000,
    currency: 'INR',
    experience_required: 3,
    job_type: 'full-time',
    work_mode: 'hybrid',
    location_city: 'Bangalore',
    location_state: 'Karnataka',
    country: 'India',
    openings_count: 5,
    status: 'open',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000102',
    job_id: 'job_uiux_02',
    title: 'UI/UX Product Designer & Developer',
    role: 'UI/UX Design',
    company_name: 'Hyperion Innovations',
    description: 'Designing intuitive design systems, mobile apps, and modern responsive interfaces for high-growth tech platforms.',
    requirements: 'Proficiency in Figma and Adobe XD\nStrong understanding of responsive HTML/CSS\nPortfolio demonstrating end-to-end UX research',
    responsibilities: 'Create wireframes, user flows, and interactive prototypes\nConduct user testing and iterate based on user feedback\nMaintain design system tokens and component libraries',
    salary_min: 600000,
    salary_max: 1400000,
    currency: 'INR',
    experience_required: 2,
    job_type: 'full-time',
    work_mode: 'remote',
    location_city: 'Mumbai',
    location_state: 'Maharashtra',
    country: 'India',
    openings_count: 4,
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000103',
    job_id: 'job_qa_03',
    title: 'Lead Quality Assurance Automation Engineer',
    role: 'Quality Assurance',
    company_name: 'Centennial Infotech',
    description: 'Automating regression suites, API testing, and ensuring product reliability across web and mobile platforms.',
    requirements: '4+ years in automated software testing\nExperience with Cypress, Playwright, or Selenium\nStrong API testing skills with Postman & Jest',
    responsibilities: 'Develop end-to-end automated test suites\nIdentify bugs and work with developers to resolve issues\nImplement CI/CD pipeline test integrations',
    salary_min: 700000,
    salary_max: 1300000,
    currency: 'INR',
    experience_required: 4,
    job_type: 'full-time',
    work_mode: 'onsite',
    location_city: 'Delhi',
    location_state: 'Delhi',
    country: 'India',
    openings_count: 3,
    status: 'open',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000104',
    job_id: 'job_devops_04',
    title: 'DevOps & Cloud Infrastructure Engineer',
    role: 'IT Consulting',
    company_name: 'Apex Cloud Systems',
    description: 'Managing AWS infrastructure, Docker containers, Kubernetes clusters, and automated deployment pipelines.',
    requirements: 'Experience with AWS services (EC2, S3, ECS, EKS)\nProficiency in Terraform, Docker, & Kubernetes\nStrong Bash/Python scripting abilities',
    responsibilities: 'Monitor system uptime and security compliance\nAutomate CI/CD pipelines for zero-downtime releases\nOptimize cloud server costs and resource usage',
    salary_min: 1000000,
    salary_max: 2000000,
    currency: 'INR',
    experience_required: 4,
    job_type: 'full-time',
    work_mode: 'hybrid',
    location_city: 'Hyderabad',
    location_state: 'Telangana',
    country: 'India',
    openings_count: 6,
    status: 'open',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000105',
    job_id: 'job_react_05',
    title: 'Frontend React.js Specialist',
    role: 'Web Development',
    company_name: 'Vanguard Digital Lab',
    description: 'Crafting pixel-perfect, high-performance web applications using React, TailwindCSS, and state management tools.',
    requirements: 'Deep knowledge of React 18, Hooks, & Context API\nMastery of Vanilla CSS, TailwindCSS, and animation libraries\nExperience with web performance optimization',
    responsibilities: 'Build reusable UI component suites\nIntegrate backend APIs with dynamic state handling\nEnsure accessibility (a11y) and cross-browser compatibility',
    salary_min: 750000,
    salary_max: 1500000,
    currency: 'INR',
    experience_required: 2,
    job_type: 'full-time',
    work_mode: 'remote',
    location_city: 'Pune',
    location_state: 'Maharashtra',
    country: 'India',
    openings_count: 5,
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000106',
    job_id: 'job_mobile_06',
    title: 'React Native & Mobile App Developer',
    role: 'App Development',
    company_name: 'Mobility Matrix',
    description: 'Building cross-platform iOS and Android applications with rich UI and seamless native module integration.',
    requirements: 'Experience with React Native and Expo framework\nUnderstanding of App Store and Google Play deployment\nKnowledge of native iOS/Android bridge components',
    responsibilities: 'Develop fluid mobile applications\nIntegrate push notifications and location services\nMaintain app stability and patch crashes',
    salary_min: 800000,
    salary_max: 1600000,
    currency: 'INR',
    experience_required: 3,
    job_type: 'full-time',
    work_mode: 'hybrid',
    location_city: 'Chennai',
    location_state: 'Tamil Nadu',
    country: 'India',
    openings_count: 4,
    status: 'open',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000107',
    job_id: 'job_data_07',
    title: 'Data Analyst & BI Specialist',
    role: 'IT Consulting',
    company_name: 'Insight Analytics Group',
    description: 'Analyzing large datasets, creating interactive dashboards, and driving business decision-making with data.',
    requirements: 'Strong SQL skills and data modeling expertise\nProficiency in Python (Pandas/NumPy) or R\nExperience with Tableau or PowerBI dashboards',
    responsibilities: 'Build automated reporting dashboards\nAnalyze user acquisition and engagement metrics\nDeliver actionable data insights to executive teams',
    salary_min: 650000,
    salary_max: 1350000,
    currency: 'INR',
    experience_required: 2,
    job_type: 'full-time',
    work_mode: 'remote',
    location_city: 'Gurgaon',
    location_state: 'Haryana',
    country: 'India',
    openings_count: 3,
    status: 'open',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '650000000000000000000108',
    job_id: 'job_backend_08',
    title: 'Backend Node.js Microservices Engineer',
    role: 'Software Development',
    company_name: 'Centennial Solutions',
    description: 'Designing high-throughput backend services, Redis caching layers, and database clusters for enterprise clients.',
    requirements: 'Expertise in Node.js, Express, and MongoDB/PostgreSQL\nKnowledge of event-driven architecture (RabbitMQ/Kafka)\nUnderstanding of security best practices (OAuth, JWT)',
    responsibilities: 'Develop scalable API endpoints\nImplement database query indexing and caching strategies\nEnsure enterprise system security and compliance',
    salary_min: 850000,
    salary_max: 1700000,
    currency: 'INR',
    experience_required: 3,
    job_type: 'full-time',
    work_mode: 'onsite',
    location_city: 'Noida',
    location_state: 'Uttar Pradesh',
    country: 'India',
    openings_count: 4,
    status: 'open',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultUsers = [
  {
    _id: '650000000000000000000001',
    first_name: 'Demo',
    last_name: 'Candidate',
    email: 'user@demo.com',
    role: 'user',
    phone: '9876543210'
  },
  {
    _id: '650000000000000000000002',
    first_name: 'Demo',
    last_name: 'Recruiter',
    email: 'admin@demo.com',
    role: 'admin',
    phone: '9876543211'
  }
];

const initDb = () => {
  if (!localStorage.getItem('local_jobs')) {
    localStorage.setItem('local_jobs', JSON.stringify(defaultJobs));
  }
  if (!localStorage.getItem('local_applications')) {
    localStorage.setItem('local_applications', JSON.stringify([]));
  }
  if (!localStorage.getItem('local_users')) {
    localStorage.setItem('local_users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('local_profile')) {
    localStorage.setItem('local_profile', JSON.stringify({
      first_name: 'Demo',
      last_name: 'Candidate',
      email: 'user@demo.com',
      phone: '9876543210',
      location_city: 'Delhi',
      location_state: 'Delhi',
      degree: 'B.Tech',
      branch: 'Computer Science',
      university: 'Delhi Technological University',
      experience_years: '2',
      current_company: 'Indie Tech',
      resume_url: '',
      skills: ['React', 'Node.js', 'MongoDB']
    }));
  }
  if (!localStorage.getItem('local_max_slots')) {
    localStorage.setItem('local_max_slots', '3');
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: async (config) => {
    initDb();

    let path = config.url.replace(config.baseURL, '');
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    const [cleanPath, queryStr] = path.split('?');
    const params = new URLSearchParams(queryStr || '');
    const method = config.method.toLowerCase();

    const getJobsList = () => JSON.parse(localStorage.getItem('local_jobs') || '[]');
    const saveJobsList = (list) => localStorage.setItem('local_jobs', JSON.stringify(list));

    const getAppsList = () => JSON.parse(localStorage.getItem('local_applications') || '[]');
    const saveAppsList = (list) => localStorage.setItem('local_applications', JSON.stringify(list));

    const getProfile = () => JSON.parse(localStorage.getItem('local_profile') || '{}');
    const saveProfile = (p) => localStorage.setItem('local_profile', JSON.stringify(p));

    const getUsers = () => JSON.parse(localStorage.getItem('local_users') || '[]');
    const saveUsers = (list) => localStorage.setItem('local_users', JSON.stringify(list));

    const parsePayload = (d) => {
      if (!d) return {};
      if (typeof d === 'object') return d;
      try {
        return JSON.parse(d);
      } catch (e) {
        return {};
      }
    };

    // A. AUTH ENDPOINTS
    // POST /auth/register
    if (cleanPath === '/auth/register' && method === 'post') {
      const data = parsePayload(config.data);
      const users = getUsers();
      const existing = users.find(u => u.email === data.email);
      if (existing) {
        return { data: { message: 'User already exists' }, status: 400, statusText: 'Bad Request', headers: {}, config };
      }
      const newUser = {
        _id: 'user_' + Date.now(),
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email,
        role: data.role || 'user',
        phone: data.phone || '9876543210'
      };
      users.push(newUser);
      saveUsers(users);

      // Also set as active profile if user
      if (newUser.role === 'user') {
        saveProfile({
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone: newUser.phone,
          location_city: '',
          location_state: '',
          degree: '',
          branch: '',
          university: '',
          experience_years: '',
          current_company: '',
          resume_url: '',
          skills: []
        });
      }

      return {
        data: {
          user: newUser,
          token: 'mock_jwt_token_demo'
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config
      };
    }

    // POST /auth/login
    if (cleanPath === '/auth/login' && method === 'post') {
      const data = parsePayload(config.data);
      const users = getUsers();
      const user = users.find(u => u.email === data.email) || users[0];
      
      // Auto register if it is a new user login for convenience
      if (data.email && !users.find(u => u.email === data.email)) {
        const newUser = {
          _id: 'user_' + Date.now(),
          first_name: data.first_name || 'Demo',
          last_name: data.last_name || 'User',
          email: data.email,
          role: data.role || 'user',
          phone: data.phone || '9876543210'
        };
        users.push(newUser);
        saveUsers(users);
        
        if (newUser.role === 'user') {
          saveProfile({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            phone: newUser.phone,
            location_city: '',
            location_state: '',
            degree: '',
            branch: '',
            university: '',
            experience_years: '',
            current_company: '',
            resume_url: '',
            skills: []
          });
        }
        
        return {
          data: {
            user: newUser,
            token: 'mock_jwt_token_demo'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        };
      }

      return {
        data: {
          user,
          token: 'mock_jwt_token_demo'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // B. JOB ENDPOINTS
    // GET /jobs
    if (cleanPath === '/jobs' && method === 'get') {
      let list = getJobsList();
      const keyword = params.get('keyword');
      const location = params.get('location');
      const job_type = params.get('job_type');
      const role = params.get('role');

      if (keyword) {
        const kw = keyword.toLowerCase();
        list = list.filter(j => j.title.toLowerCase().includes(kw) || j.company_name.toLowerCase().includes(kw));
      }
      if (location) {
        const loc = location.toLowerCase();
        list = list.filter(j => j.location_city.toLowerCase().includes(loc) || (j.location_state && j.location_state.toLowerCase().includes(loc)));
      }
      if (job_type) {
        list = list.filter(j => j.job_type === job_type);
      }
      if (role) {
        list = list.filter(j => j.role === role);
      }
      return { data: list, status: 200, statusText: 'OK', headers: {}, config };
    }

    // GET /jobs/categories/all
    if (cleanPath === '/jobs/categories/all' && method === 'get') {
      const list = getJobsList();
      const localCats = JSON.parse(localStorage.getItem('local_categories') || '[]');
      const roleNames = Array.from(new Set(list.map(j => j.role)));
      const catNames = localCats.map(c => c.name);
      const allNames = Array.from(new Set([...roleNames, ...catNames]));
      const roles = allNames.map(name => ({ name }));
      return { data: roles.length > 0 ? roles : [{ name: 'Software Development' }, { name: 'UI/UX Design' }], status: 200, statusText: 'OK', headers: {}, config };
    }

    // POST /jobs/categories/add — MUST be before /jobs/:id
    if (cleanPath === '/jobs/categories/add' && method === 'post') {
      const data = JSON.parse(config.data || '{}');
      const cats = JSON.parse(localStorage.getItem('local_categories') || '[]');
      const newCat = { _id: 'cat_' + Date.now(), name: data.name };
      cats.push(newCat);
      localStorage.setItem('local_categories', JSON.stringify(cats));
      return { data: newCat, status: 201, statusText: 'Created', headers: {}, config };
    }

    // DELETE /jobs/categories/:id — MUST be before /jobs/:id
    const catDeleteMatch = cleanPath.match(/^\/jobs\/categories\/(.+)$/);
    if (catDeleteMatch && method === 'delete') {
      const catId = decodeURIComponent(catDeleteMatch[1]);
      let cats = JSON.parse(localStorage.getItem('local_categories') || '[]');
      cats = cats.filter(c => c._id !== catId && c.name !== catId);
      localStorage.setItem('local_categories', JSON.stringify(cats));
      return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // GET /jobs/admin/all — MUST be before /jobs/:id
    if (cleanPath === '/jobs/admin/all' && method === 'get') {
      const list = getJobsList();
      const apps = getAppsList();
      const enriched = list.map(j => {
        const appCount = apps.filter(a => {
          const aJobId = typeof a.job_id === 'object' ? a.job_id?._id : a.job_id;
          return aJobId === j._id || aJobId === j.job_id;
        }).length;
        return { ...j, applicationCount: appCount };
      });
      return { data: enriched, status: 200, statusText: 'OK', headers: {}, config };
    }

    // GET /jobs/admin/stats — MUST be before /jobs/:id
    if (cleanPath === '/jobs/admin/stats' && method === 'get') {
      const list = getJobsList();
      const apps = getAppsList();
      const maxSlots = parseInt(localStorage.getItem('local_max_slots') || '3');
      const stats = {
        totalJobs: list.length,
        totalApplications: apps.length,
        activeJobs: list.filter(j => j.status === 'open').length,
        maxJobsAllowed: maxSlots,
        purchased_slots: Math.max(0, maxSlots - 3)
      };
      return { data: stats, status: 200, statusText: 'OK', headers: {}, config };
    }

    // GET /jobs/:id — catch-all for job detail (AFTER all specific /jobs/* routes)
    const jobDetailMatch = cleanPath.match(/^\/jobs\/([a-zA-Z0-9_-]+)$/);
    if (jobDetailMatch && method === 'get') {
      const id = jobDetailMatch[1];
      const list = getJobsList();
      const job = list.find(j => j._id === id || j.job_id === id) || list[0];
      const apps = getAppsList();
      const applicationCount = apps.filter(a => a.job_id === id || (a.job_id && a.job_id._id === id)).length;
      return { data: { ...job, applicationCount }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // POST /jobs (Create job)
    if (cleanPath === '/jobs' && method === 'post') {
      const data = parsePayload(config.data);
      const list = getJobsList();
      const newJob = {
        _id: 'job_' + Date.now(),
        job_id: 'job_custom_' + Date.now(),
        status: 'open',
        createdAt: new Date().toISOString(),
        ...data
      };
      list.unshift(newJob);
      saveJobsList(list);
      return { data: newJob, status: 201, statusText: 'Created', headers: {}, config };
    }

    // PUT /jobs/:id (Update job)
    if (jobDetailMatch && method === 'put') {
      const id = jobDetailMatch[1];
      const data = parsePayload(config.data);
      const list = getJobsList();
      const index = list.findIndex(j => j._id === id || j.job_id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...data };
        saveJobsList(list);
        return { data: list[index], status: 200, statusText: 'OK', headers: {}, config };
      }
      return { data: { message: 'Job not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }

    // DELETE /jobs/:id
    if (jobDetailMatch && method === 'delete') {
      const id = jobDetailMatch[1];
      let list = getJobsList();
      list = list.filter(j => j._id !== id && j.job_id !== id);
      saveJobsList(list);
      return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // C. APPLICATION ENDPOINTS
    // POST /applications
    if (cleanPath === '/applications' && method === 'post') {
      const data = parsePayload(config.data);
      const apps = getAppsList();

      const newApp = {
        _id: 'app_' + Date.now(),
        status: 'applied',
        createdAt: new Date().toISOString(),
        user_id: getProfile(),
        ...data
      };
      apps.unshift(newApp);
      saveAppsList(apps);
      return { data: newApp, status: 201, statusText: 'Created', headers: {}, config };
    }

    // GET /applications/my/all
    if (cleanPath === '/applications/my/all' && method === 'get') {
      const apps = getAppsList();
      const jobs = getJobsList();
      const userEmail = getProfile().email || 'user@demo.com';

      // Retrieve all local applications
      const myApps = apps.filter(a => a.user_id?.email === userEmail || a.user_id === userEmail || !a.user_id).map(a => {
        const matchedJob = jobs.find(j => j._id === a.job_id || j.job_id === a.job_id) || jobs[0];
        return { ...a, job_id: matchedJob };
      });
      return { data: myApps, status: 200, statusText: 'OK', headers: {}, config };
    }

    // GET /applications/job/:jobId
    const jobAppsMatch = cleanPath.match(/^\/applications\/job\/([a-zA-Z0-9_-]+)$/);
    if (jobAppsMatch && method === 'get') {
      const jobId = jobAppsMatch[1];
      const apps = getAppsList();
      const jobApps = apps.filter(a => (a.job_id === jobId || (a.job_id && a.job_id._id === jobId)) && !a.is_deleted_by_recruiter);
      return { data: jobApps, status: 200, statusText: 'OK', headers: {}, config };
    }

    // GET /applications/admin/candidates
    if (cleanPath === '/applications/admin/candidates' && method === 'get') {
      const apps = getAppsList().filter(a => !a.is_deleted_by_recruiter);
      const jobs = getJobsList();
      const populated = apps.map(a => {
        const matchedJob = jobs.find(j => j._id === a.job_id || j.job_id === a.job_id) || jobs[0];
        return { ...a, job_id: matchedJob };
      });
      return {
        data: {
          success: true,
          count: populated.length,
          total: populated.length,
          page: 1,
          pages: 1,
          data: populated
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // PUT /applications/:id/status
    const appStatusMatch = cleanPath.match(/^\/applications\/([a-zA-Z0-9_-]+)\/status$/);
    if (appStatusMatch && method === 'put') {
      const appId = appStatusMatch[1];
      const data = parsePayload(config.data);
      const apps = getAppsList();
      const index = apps.findIndex(a => a._id === appId);
      if (index !== -1) {
        apps[index].status = data.status;
        saveAppsList(apps);
        return { data: apps[index], status: 200, statusText: 'OK', headers: {}, config };
      }
      return { data: { message: 'Application not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }

    // DELETE /applications/:id
    const appDetailMatch = cleanPath.match(/^\/applications\/([a-zA-Z0-9_-]+)$/);
    if (appDetailMatch && method === 'delete') {
      const appId = appDetailMatch[1];
      const apps = getAppsList();
      const index = apps.findIndex(a => a._id === appId);
      if (index !== -1) {
        apps[index].is_deleted_by_recruiter = true;
        saveAppsList(apps);
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }
      return { data: { message: 'Application not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }

    // D. PROFILE ENDPOINTS
    // GET /auth/user/profile
    if (cleanPath === '/auth/user/profile' && method === 'get') {
      const p = getProfile();
      return { data: p, status: 200, statusText: 'OK', headers: {}, config };
    }

    // PUT /auth/user/update-profile
    if (cleanPath === '/auth/user/update-profile' && method === 'put') {
      const data = parsePayload(config.data);
      const p = getProfile();
      const updated = { ...p, ...data };
      saveProfile(updated);
      return { data: { user: updated }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // E. UPLOAD ENDPOINT
    // POST /upload/resume
    if (cleanPath === '/upload/resume' && method === 'post') {
      return { data: { url: 'https://res.cloudinary.com/demo/image/upload/sample_resume.pdf' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // H. PAYMENT ENDPOINTS (all sandbox/mock)
    if (cleanPath.startsWith('/payment/') && method === 'post') {
      // Handle all payment endpoints as successful
      const maxSlots = parseInt(localStorage.getItem('local_max_slots') || '3');
      const data = parsePayload(config.data);
      const newSlots = maxSlots + (data.slots || 1);
      localStorage.setItem('local_max_slots', String(newSlots));
      return {
        data: {
          success: true,
          message: 'Payment processed successfully (sandbox)',
          maxJobsAllowed: newSlots,
          purchased_slots: newSlots,
          orderID: 'sandbox_order_' + Date.now(),
          id: 'sandbox_order_' + Date.now()
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // I. GET /applications/:id (single application detail)
    if (appDetailMatch && method === 'get') {
      const appId = appDetailMatch[1];
      const apps = getAppsList();
      const jobs = getJobsList();
      const app = apps.find(a => a._id === appId);
      if (app) {
        const matchedJob = jobs.find(j => j._id === app.job_id || j.job_id === app.job_id) || jobs[0];
        return { data: { ...app, job_id: matchedJob }, status: 200, statusText: 'OK', headers: {}, config };
      }
      return { data: { _id: appId, status: 'applied', job_id: jobs[0], user_id: getProfile(), createdAt: new Date().toISOString() }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // J. AUTH ADMIN LOGIN  
    if (cleanPath === '/auth/admin/login' && method === 'post') {
      const data = parsePayload(config.data);
      const users = getUsers();
      let admin = users.find(u => u.email === data.email && u.role === 'admin');
      if (!admin) {
        admin = { _id: '650000000000000000000002', first_name: 'Demo', last_name: 'Recruiter', email: data.email || 'admin@demo.com', role: 'admin' };
        users.push(admin);
        saveUsers(users);
      }
      return { data: { user: admin, token: 'mock_jwt_token_demo', role: 'admin' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // K. HEALTH CHECK
    if (cleanPath === '/health' && method === 'get') {
      return { data: { status: 'ok', message: 'API is healthy (localStorage mode)' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // DEFAULT FALLBACK - never throw, always return success
    console.warn('[LocalDB Adapter] Unhandled route:', method.toUpperCase(), cleanPath);
    return {
      data: { message: 'Route handled (localStorage fallback)', success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;