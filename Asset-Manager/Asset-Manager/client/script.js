/**
 * ScholarVault Logic
 * Handles Authentication, File Management, and UI Rendering
 */

// --- Dark Mode Toggle ---
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check saved preference
    const saved = localStorage.getItem('sv_theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('sv_theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// --- Constants & Config ---
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'password123' 
};

// Sample Papers for Demo
const SAMPLE_PAPERS = [
  {
    id: 'sample-1',
    title: 'Data Structures',
    year: '2024',
    semester: '3',
    description: 'Comprehensive exam on arrays, linked lists, trees, and graphs. Focus on time complexity analysis and implementation patterns.',
    fileName: 'DataStructures_2024_Sem3.pdf',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcw0KL0tpZHNbMyAwIFJdDQovQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+Pj4+Pj4vQ29udGVudHMgNCAwIFI+PmVuZG9iCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iCjQgMCBvYmo8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcyMCBUZAooRGF0YSBTdHJ1Y3R1cmVzKSBUaoKRVQKZW5kc3RyZWFtCmVuZG9iCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMzI0NiAwMCBuIAowMDAwMDAwMDEwIDAwIG4gCjAwMDAwMDAyNDcgMDAgbiAKMDAwMDAwMDMyOCAwMCBuIApzdGFydHhyZWYKNDIxCiUlRU9G',
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sample-2',
    title: 'Database Management Systems',
    year: '2024',
    semester: '4',
    description: 'SQL queries, normalization, transactions, and indexing. Practice problems include complex joins and database design.',
    fileName: 'DBMS_2024_Sem4.pdf',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcw0KL0tpZHNbMyAwIFJdDQovQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+Pj4+Pj4vQ29udGVudHMgNCAwIFI+PmVuZG9iCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iCjQgMCBvYjo8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcyMCBUZAooREJNUykgVGoKRVQKZW5kc3RyZWFtCmVuZG9iCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMzI0NiAwMCBuIAowMDAwMDAwMDEwIDAwIG4gCjAwMDAwMDAyNDcgMDAgbiAKMDAwMDAwMDMyOCAwMCBuIApzdGFydHhyZWYKNDIxCiUlRU9G',
    uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sample-3',
    title: 'Web Development',
    year: '2023',
    semester: '4',
    description: 'HTML5, CSS3, JavaScript fundamentals. Questions on DOM manipulation, async operations, and modern web APIs.',
    fileName: 'WebDev_2023_Sem4.pdf',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcw0KL0tpZHNbMyAwIFJdDQovQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+Pj4+Pj4vQ29udGVudHMgNCAwIFI+PmVuZG9iCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iCjQgMCBvYjo8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcyMCBUZAooV2ViIERldikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMzI0NiAwMCBuIAowMDAwMDAwMDEwIDAwIG4gCjAwMDAwMDAyNDcgMDAgbiAKMDAwMDAwMDMyOCAwMCBuIApzdGFydHhyZWYKNDIxCiUlRU9G',
    uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sample-4',
    title: 'Operating Systems',
    year: '2023',
    semester: '5',
    description: 'Process scheduling, memory management, deadlocks, and file systems. Includes algorithm explanations and examples.',
    fileName: 'OS_2023_Sem5.pdf',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcw0KL0tpZHNbMyAwIFJdDQovQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+Pj4+Pj4vQ29udGVudHMgNCAwIFI+PmVuZG9iCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iCjQgMCBvYjo8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcyMCBUZAooT1MpIFRqCkVUCmVuZHN0cmVhbQplbmRvYgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDMyNDYgMDAgbiAKMDAwMDAwMDAxMCAwMCBuIAowMDAwMDAwMjQ3IDAwIG4gCjAwMDAwMDAzMjggMDAgbiAKc3RhcnR4cmVmCjQyMQolJUVPRg==',
    uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sample-5',
    title: 'Software Engineering',
    year: '2023',
    semester: '6',
    description: 'SDLC, design patterns, UML diagrams, testing methodologies. Case studies on real-world software projects.',
    fileName: 'SE_2023_Sem6.pdf',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcw0KL0tpZHNbMyAwIFJdDQovQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+Pj4+Pj4vQ29udGVudHMgNCAwIFI+PmVuZG9iCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iCjQgMCBvYjo8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcyMCBUZAooU0UpIFRqCkVUCmVuZHN0cmVhbQplbmRvYgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDMyNDYgMDAgbiAKMDAwMDAwMDAxMCAwMCBuIAowMDAwMDAwMjQ3IDAwIG4gCjAwMDAwMDAzMjggMDAgbiAKc3RhcnR4cmVmCjQyMQolJUVPRg==',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// --- State Management (LocalStorage Wrapper) ---
const DB = {
    getUsers: () => JSON.parse(localStorage.getItem('sv_users')) || [],
    saveUser: (user) => {
        const users = DB.getUsers();
        users.push(user);
        localStorage.setItem('sv_users', JSON.stringify(users));
    },
    getPapers: () => {
        const stored = JSON.parse(localStorage.getItem('sv_papers'));
        // If no papers stored, return sample papers
        if (!stored || stored.length === 0) {
            return SAMPLE_PAPERS;
        }
        return stored;
    },
    savePaper: (paper) => {
        const papers = DB.getPapers();
        papers.push(paper);
        localStorage.setItem('sv_papers', JSON.stringify(papers));
    },
    deletePaper: (id) => {
        const papers = DB.getPapers().filter(p => p.id !== id);
        localStorage.setItem('sv_papers', JSON.stringify(papers));
    },
    getSession: () => JSON.parse(sessionStorage.getItem('sv_session')),
    setSession: (user) => sessionStorage.setItem('sv_session', JSON.stringify(user)),
    clearSession: () => sessionStorage.removeItem('sv_session')
};

// --- Utilities ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
});

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger reflow for animation
    toast.offsetHeight;
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Auth Logic ---
function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    // Check Admin
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        DB.setSession({ username, role: 'admin', name: 'Administrator' });
        window.location.href = './admin.html';
        return;
    }

    // Check User
    const users = DB.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        DB.setSession({ ...user, role: 'user' });
        window.location.href = './dashboard.html';
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = event.target.fullname.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirm_password.value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    const users = DB.getUsers();
    if (users.find(u => u.username === username)) {
        showToast('Username already taken', 'error');
        return;
    }

    DB.saveUser({ id: generateId(), name, username, password });
    showToast('Registration successful! Please login.');
    setTimeout(() => window.location.href = './login.html', 1500);
}

function handleLogout() {
    DB.clearSession();
    window.location.href = './index.html';
}

function checkAuth(requiredRole = null) {
    const session = DB.getSession();
    if (!session) {
        window.location.href = './login.html';
        return null;
    }
    if (requiredRole && session.role !== requiredRole) {
        window.location.href = requiredRole === 'admin' ? './admin.html' : './dashboard.html';
        return null;
    }
    return session;
}

// --- File Handling ---
function handleFileUpload(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (!file) {
        showToast('Please select a file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('File size too large (Max 5MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const paper = {
            id: generateId(),
            title: event.target.subject.value,
            year: event.target.year.value,
            semester: event.target.semester.value,
            description: event.target.description.value,
            fileName: file.name,
            fileData: e.target.result, // Base64
            uploadedAt: new Date().toISOString()
        };

        try {
            DB.savePaper(paper);
            showToast('Paper uploaded successfully!');
            event.target.reset();
            renderAdminPapers(); // Refresh list if on admin page
        } catch (err) {
            showToast('Storage full! Cannot upload more files.', 'error');
            console.error(err);
        }
    };
    reader.readAsDataURL(file);
}

// --- Rendering ---
function renderPapers(filters = {}) {
    const container = document.getElementById('papers-grid');
    if (!container) return;

    let papers = DB.getPapers();

    // Filter Logic
    if (filters.search) {
        const term = filters.search.toLowerCase();
        papers = papers.filter(p => 
            p.title.toLowerCase().includes(term) || 
            p.description.toLowerCase().includes(term) ||
            p.year.toString().includes(term)
        );
    }
    if (filters.year) {
        papers = papers.filter(p => p.year === filters.year);
    }

    container.innerHTML = papers.length ? papers.map(paper => `
        <div class="paper-card" data-testid="card-paper-${paper.id}">
            <div class="paper-header">
                <div class="paper-subject">${paper.title}</div>
                <div class="paper-meta">
                    <span>${paper.year}</span>
                    <span>•</span>
                    <span>Sem ${paper.semester}</span>
                </div>
            </div>
            <div class="paper-body">
                <p class="paper-desc">${paper.description}</p>
                <small class="text-muted">📅 ${formatDate(paper.uploadedAt)}</small>
            </div>
            <div class="paper-footer">
                <span class="text-muted" style="font-size: 0.85rem;">📄 ${paper.fileName}</span>
                <a href="${paper.fileData}" download="${paper.fileName}" class="btn btn-sm btn-primary" data-testid="button-download-${paper.id}">
                    Download
                </a>
            </div>
        </div>
    `).join('') : '<div class="empty-state"><h3>No papers found</h3><p>Try adjusting your search or filters.</p></div>';
}

function renderAdminPapers() {
    const container = document.getElementById('admin-papers-list');
    if (!container) return;

    const papers = DB.getPapers();
    container.innerHTML = papers.length ? papers.map(paper => `
        <div class="paper-card" data-testid="admin-card-${paper.id}">
            <div class="paper-header">
                <div class="paper-subject">${paper.title}</div>
                <div class="paper-meta">📅 ${paper.year} | Sem: ${paper.semester}</div>
            </div>
            <div class="paper-body">
                <p class="paper-desc">${paper.description}</p>
            </div>
            <div class="paper-footer">
                <a href="${paper.fileData}" download="${paper.fileName}" class="btn btn-sm btn-outline" data-testid="button-view-${paper.id}">View</a>
                <button onclick="confirmDelete('${paper.id}')" class="btn btn-sm btn-danger" data-testid="button-delete-${paper.id}">Delete</button>
            </div>
        </div>
    `).join('') : '<div class="empty-state"><h3>No papers uploaded</h3><p>Upload your first paper using the form above.</p></div>';
}

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    initThemeToggle();

    const path = window.location.pathname;
    const session = DB.getSession();

    // Navbar User Name
    const navUser = document.getElementById('nav-user');
    if (navUser && session) {
        navUser.textContent = `👤 ${session.name}`;
    }

    // Route Handling
    if (path.includes('admin.html')) {
        checkAuth('admin');
        renderAdminPapers();
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) uploadForm.addEventListener('submit', handleFileUpload);
    } 
    else if (path.includes('dashboard.html')) {
        checkAuth('user');
        renderPapers();
        
        // Search & Filter Listeners
        const searchInput = document.getElementById('search-input');
        const yearSelect = document.getElementById('year-filter');
        
        const applyFilters = () => {
            renderPapers({
                search: searchInput?.value || '',
                year: yearSelect?.value || ''
            });
        };

        searchInput?.addEventListener('input', applyFilters);
        yearSelect?.addEventListener('change', applyFilters);
    }
    else if (path.includes('login.html')) {
        if (session) window.location.href = session.role === 'admin' ? './admin.html' : './dashboard.html';
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
    }
    else if (path.includes('register.html')) {
        if (session) window.location.href = './dashboard.html';
        const registerForm = document.getElementById('register-form');
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
    }

    // Add staggered animation to feature cards on home page
    const cards = document.querySelectorAll('.papers-grid .paper-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Global functions for HTML onclick attributes
window.handleLogout = handleLogout;

window.confirmDelete = (id) => {
    if(confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
        DB.deletePaper(id);
        renderAdminPapers();
        showToast('Paper deleted successfully');
    }
};
