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
    }

    async function loadUserName() {
        const token = getToken();
        if (!token) {
            userMenu.classList.remove('show');
            userMenu.style.display = 'none';
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
        const editName = window.confirm('Želite da izmenite korisničko ime? Kliknite "OK" za ime, "Cancel" za lozinku.');

        if (editName) {
            const newName = window.prompt('Unesite novo korisničko ime:');
            if (!newName || !newName.trim()) return;
            const confirmed = window.confirm('Da li ste sigurni da želite da promenite korisničko ime?');
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

        const newPassword = window.prompt('Unesite novu lozinku:');
        if (!newPassword || !newPassword.trim()) return;
        const confirmed = window.confirm('Da li ste sigurni da želite da promenite lozinku?');
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
        const confirmed = window.confirm('Da li ste sigurni da želite da obrišete nalog? Ova akcija je nepovratna.');
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
})();
