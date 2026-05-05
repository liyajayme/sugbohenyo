
const AuthDB = (() => {

    const USERS_KEY   = 'sh_users';
    const SESSION_KEY = 'sh_session';
    const SESSION_TTL = 60 * 60 * 1000; 

    
    function hashPassword(password) {
        let h = 5381;
        for (let i = 0; i < password.length; i++) {
            h = Math.imul(h, 33) ^ password.charCodeAt(i);
        }
        return (h >>> 0).toString(16).padStart(8, '0');
    }

    function generateToken(bytes = 24) {
        const arr = new Uint8Array(bytes);
        crypto.getRandomValues(arr);
        return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function createSession(user) {
        const session = {
            token     : generateToken(),
            userId    : user.id,
            username  : user.username,
            firstname : user.firstname,
            lastname  : user.lastname,
            email     : user.email,
            role      : user.role,
            createdAt : Date.now(),
            expiresAt : Date.now() + SESSION_TTL,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }


    /**
     * Register a new user.
     * @param {{ firstname, lastname, username, email, password }} data
     * @returns {{ ok: boolean, error?: string, field?: string }}
     */
    function register({ firstname, lastname, username, email, password }) {
        const users = loadUsers();

        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { ok: false, field: 'username', error: 'Username is already taken.' };
        }
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { ok: false, field: 'email', error: 'An account with this email already exists.' };
        }

        const user = {
            id           : Date.now(),
            firstname    : firstname.trim(),
            lastname     : lastname.trim(),
            username     : username.trim(),
            email        : email.trim().toLowerCase(),
            passwordHash : hashPassword(password),
            role         : 'student',
            createdAt    : new Date().toISOString(),
        };

        users.push(user);
        saveUsers(users);

        createSession(user);

        return { ok: true };
    }

    /**
     * Log in an existing user.
     * @param {{ username, password }} data
     * @returns {{ ok: boolean, error?: string, field?: string }}
     */
    function login({ username, password }) {
        const users = loadUsers();

        const user = users.find(
            u => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            return { ok: false, field: 'username', error: 'No account found with that username.' };
        }

        if (user.passwordHash !== hashPassword(password)) {
            return { ok: false, field: 'password', error: 'Incorrect password.' };
        }

        createSession(user);
        return { ok: true };
    }

    
    function logout() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('username');
        localStorage.removeItem('firstname');
        localStorage.removeItem('email');
    }

    
    function getSession() {
        try {
            const session = JSON.parse(localStorage.getItem(SESSION_KEY));
            if (!session) return null;
            if (Date.now() > session.expiresAt) {
                logout();   
                return null;
            }
            return session;
        } catch {
            return null;
        }
    }

    
    function requireAuth(redirectTo = 'login.html') {
        if (!getSession()) {
            window.location.href = redirectTo;
        }
    }

    return { register, login, logout, getSession, requireAuth };
})();



(function attachLoginHandler() {
    const form = document.getElementById('login-form');
    if (!form) return;

    const freshForm = form.cloneNode(true);
    form.parentNode.replaceChild(freshForm, form);

    freshForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');

        const username = usernameEl.value.trim();
        const password = passwordEl.value;

        if (!username || !password) {
            showLoginError('Please fill in all fields.');
            return;
        }

        const result = AuthDB.login({ username, password });

        if (!result.ok) {
            showLoginError(result.error, result.field);
            return;
        }

        window.location.href = 'dashboard.html';
    });

    function showLoginError(message, field) {
        document.querySelectorAll('.auth-error-msg').forEach(el => el.remove());

        const banner = document.createElement('p');
        banner.className = 'auth-error-msg';
        banner.textContent = '⚠ ' + message;
        banner.style.cssText = `
            color: #e05050;
            font-size: 0.82rem;
            margin-top: 0.5rem;
            text-align: center;
        `;

        const anchor = field === 'password'
            ? document.getElementById('password').closest('.input-box')
            : field === 'username'
                ? document.getElementById('username').closest('.input-box')
                : document.querySelector('#login-form button[type="submit"]');

        if (anchor) anchor.insertAdjacentElement('afterend', banner);
    }
})();




(function attachSignupHandler() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    const freshForm = form.cloneNode(true);
    form.parentNode.replaceChild(freshForm, form);

    ['firstname','lastname','username','email','password','confirm-password'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
            this.classList.remove('invalid');
            const errId = 'err-' + (id === 'confirm-password' ? 'confirm' : id);
            const errEl = document.getElementById(errId);
            if (errEl) errEl.textContent = '';
        });
    });

    const pwEl = document.getElementById('password');
    if (pwEl) {
        pwEl.addEventListener('input', function () {
            const val = this.value;
            const wrap  = document.getElementById('strength-wrap');
            const fill  = document.getElementById('strength-fill');
            const label = document.getElementById('strength-label');
            if (!wrap) return;

            if (val.length === 0) { wrap.classList.remove('visible'); return; }

            wrap.classList.add('visible');
            fill.classList.remove('weak', 'medium', 'strong');

            let score = 0;
            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            if (score <= 1) {
                fill.classList.add('weak');
                label.textContent = 'Weak';
                label.style.color = '#e05050';
            } else if (score <= 2) {
                fill.classList.add('medium');
                label.textContent = 'Medium';
                label.style.color = '#e8a020';
            } else {
                fill.classList.add('strong');
                label.textContent = 'Strong';
                label.style.color = '#30c8b0';
            }
        });
    }

    freshForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const get  = id => document.getElementById(id);
        const setE = (id, errId, msg) => {
            get(id).classList.add('invalid');
            get(id).classList.remove('valid');
            get(errId).textContent = msg;
            valid = false;
        };
        const setV = (id, errId) => {
            get(id).classList.remove('invalid');
            get(id).classList.add('valid');
            get(errId).textContent = '';
        };

        let valid = true;

        const firstname = get('firstname').value.trim();
        const lastname  = get('lastname').value.trim();
        const username  = get('username').value.trim();
        const email     = get('email').value.trim();
        const password  = get('password').value;
        const confirm   = get('confirm-password').value;

        if (!firstname)     setE('firstname', 'err-firstname', 'First name is required.');
        else                setV('firstname', 'err-firstname');

        if (!lastname)      setE('lastname',  'err-lastname',  'Last name is required.');
        else                setV('lastname',  'err-lastname');

        if (username.length < 3) setE('username', 'err-username', 'Username must be at least 3 characters.');
        else                     setV('username', 'err-username');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setE('email', 'err-email', 'Please enter a valid email address.');
        else                                             setV('email', 'err-email');

        if (password.length < 8) setE('password', 'err-password', 'Password must be at least 8 characters.');
        else                     setV('password', 'err-password');

        if (confirm !== password) setE('confirm-password', 'err-confirm', 'Passwords do not match.');
        else                      setV('confirm-password', 'err-confirm');

        if (!valid) return;

        const result = AuthDB.register({ firstname, lastname, username, email, password });

        if (!result.ok) {
            const fieldMap = { username: ['username', 'err-username'], email: ['email', 'err-email'] };
            if (result.field && fieldMap[result.field]) {
                setE(...fieldMap[result.field], result.error);
            }
            return;
        }

        window.location.href = 'dashboard.html';
    });
})();