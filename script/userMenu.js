(() => {
    const AUTH_TOKEN_KEY = 'prosekatorAuthToken';
    const authLink = document.getElementById('authLink');
    const userMenu = document.getElementById('userMenu');
    const editBtn = document.getElementById('editAccountBtn');
    const deleteBtn = document.getElementById('deleteAccountBtn');

    if (!authLink || !userMenu || !editBtn || !deleteBtn) return;

    function getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    function clearToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    async function authFetch(url, options = {}) {
        const token = getToken();
        const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return fetch(url, Object.assign({}, options, { headers }));
    }

    function toggleMenu(show) {
        userMenu.classList.toggle('show', show);
        authLink.classList.toggle('active', show);
    }

    function initNavActive() {
        const navLinks = document.querySelectorAll('.navbar .nav-link');
        if (!navLinks.length) return;

        const path = window.location.pathname;
        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (!href || href === '#') return;
            const normalized = href.replace(/^\.+/g, '');
            if (path.endsWith(normalized.replace(/^\//, ''))) {
                link.classList.add('is-active');
            }

            link.addEventListener('click', () => {
                navLinks.forEach((l) => l.classList.remove('is-active'));
                link.classList.add('is-active');
            });
        });
    }

    function chooseEditAction() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'custom-confirm-overlay';

            overlay.innerHTML = `
                <div class="custom-confirm-box">
                    <button class="custom-confirm-close" aria-label="Close">×</button>
                    <div class="custom-confirm-icon warning">?</div>
                    <div class="custom-confirm-title">Izmena naloga</div>
                    <div class="custom-confirm-message">Šta želite da izmenite?</div>
                    <div class="custom-confirm-buttons">
                        <button class="custom-confirm-btn confirm" data-action="name">Korisničko ime</button>
                        <button class="custom-confirm-btn confirm" data-action="password">Lozinku</button>
                    </div>
                    <div class="custom-confirm-buttons" style="margin-top: 10px;">
                        <button class="custom-confirm-btn cancel" data-action="cancel">Otkaži</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);

            function closeModal(result) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                    resolve(result);
                }, 300);
            }

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal(null);
                }
            });

            overlay.querySelector('.custom-confirm-close').addEventListener('click', () => closeModal(null));
            overlay.querySelectorAll('[data-action]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-action');
                    if (action === 'cancel') return closeModal(null);
                    closeModal(action);
                });
            });

            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    closeModal(null);
                    document.removeEventListener('keydown', escapeHandler);
                }
            });
        });
    }

    async function loadUserName() {
        const token = getToken();
        if (!token) {
            userMenu.classList.remove('show');
            return;
        }

        try {
            const response = await authFetch('/api/user/data');
            if (response.status === 401 || response.status === 403) {
                clearToken();
                return;
            }
            if (!response.ok) return;

            const data = await response.json();
            if (data && data.name) {
                authLink.textContent = data.name;
                authLink.href = '#';
                authLink.classList.add('user-link');
            }
        } catch (err) {
            return;
        }
    }

    authLink.addEventListener('click', (e) => {
        if (!getToken()) return;
        e.preventDefault();
        toggleMenu(!userMenu.classList.contains('show'));
    });

    document.addEventListener('click', (e) => {
        if (e.target === authLink || userMenu.contains(e.target)) return;
        toggleMenu(false);
    });

    editBtn.addEventListener('click', async () => {
        toggleMenu(false);
        const action = await chooseEditAction();

        if (action === 'name') {
            const newName = await window.customPrompt({
                title: 'Novo korisničko ime',
                message: 'Unesite novo korisničko ime:',
                confirmText: 'Sačuvaj',
                cancelText: 'Otkaži'
            });
            if (!newName || !newName.trim()) return;
            const confirmed = await window.customConfirm({
                title: 'Potvrda izmene',
                message: 'Da li ste sigurni da želite da promenite korisničko ime?',
                confirmText: 'Sačuvaj',
                cancelText: 'Otkaži',
                type: 'warning'
            });
            if (!confirmed) return;

            const response = await authFetch('/api/user/update', {
                method: 'PATCH',
                body: JSON.stringify({ name: newName.trim() })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(data.error || 'Neuspešna izmena korisničkog imena.');
                return;
            }

            if (data.name) {
                authLink.textContent = data.name;
            }
            alert('Korisničko ime je uspešno izmenjeno.');
            return;
        }

        if (action !== 'password') return;

        const newPassword = await window.customPrompt({
            title: 'Nova lozinka',
            message: 'Unesite novu lozinku:',
            confirmText: 'Sačuvaj',
            cancelText: 'Otkaži',
            inputType: 'password'
        });
        if (!newPassword || !newPassword.trim()) return;
        const confirmed = await window.customConfirm({
            title: 'Potvrda izmene',
            message: 'Da li ste sigurni da želite da promenite lozinku?',
            confirmText: 'Sačuvaj',
            cancelText: 'Otkaži',
            type: 'warning'
        });
        if (!confirmed) return;

        const response = await authFetch('/api/user/update', {
            method: 'PATCH',
            body: JSON.stringify({ password: newPassword })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(data.error || 'Neuspešna izmena lozinke.');
            return;
        }

        alert('Lozinka je uspešno izmenjena.');
    });

    deleteBtn.addEventListener('click', async () => {
        toggleMenu(false);
        const confirmed = await window.customConfirm({
            title: 'Brisanje naloga',
            message: 'Da li ste sigurni da želite da obrišete nalog? Ova akcija je nepovratna.',
            confirmText: 'Obriši',
            cancelText: 'Otkaži',
            type: 'danger'
        });
        if (!confirmed) return;

        const response = await authFetch('/api/user/delete', { method: 'DELETE' });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(data.error || 'Neuspešno brisanje naloga.');
            return;
        }

        clearToken();
        window.location.href = '/docs/login.html';
    });

    loadUserName();
    initNavActive();
})();
