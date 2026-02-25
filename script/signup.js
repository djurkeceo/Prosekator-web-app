const AUTH_TOKEN_KEY = 'prosekatorAuthToken';

function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function initPasswordToggle() {
    const button = document.querySelector('[data-password-toggle]');
    if (!button) return;

    const targetId = button.getAttribute('data-password-toggle');
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;

    const setState = (show) => {
        input.type = show ? 'text' : 'password';
        button.textContent = show ? 'Sakrij' : 'Prikaži';
        button.setAttribute('aria-pressed', String(show));
        button.setAttribute('aria-label', show ? 'Sakrij lozinku' : 'Prikaži lozinku');
    };

    setState(false);
    button.addEventListener('click', () => {
        setState(input.type === 'password');
    });
}

initPasswordToggle();

function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function isPasswordStrong(password) {
    const value = String(password || '');
    return /[A-Z]/.test(value) && /[0-9]/.test(value);
}

function showInputError(input, message) {
    const tooltip = input.parentElement.querySelector('.error-tooltip');
    if (tooltip) {
        tooltip.textContent = message;
        tooltip.classList.add('visible');
    }
    input.classList.add('invalid-field');
    input.addEventListener('input', () => {
        if (tooltip) tooltip.classList.remove('visible');
        input.classList.remove('invalid-field');
    }, { once: true });
}

document.querySelector('.signupFormMain').addEventListener('submit', async function (e) {
    let inputs = this.querySelectorAll('input[required]');
    let firstInvalid = null;
    let hasError = false;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            e.preventDefault();
            hasError = true;
            showInputError(input, 'Popunite ovo polje');
            if (!firstInvalid) firstInvalid = input;
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    if (hasError) return;

    e.preventDefault();

    const name = inputs[0] ? inputs[0].value.trim() : '';
    const email = inputs[1] ? inputs[1].value.trim() : '';
    const password = inputs[2] ? inputs[2].value : '';

    if (!isEmailValid(email)) {
        showInputError(inputs[1], 'Unesite ispravan email (mora sadržati @ i .).');
        inputs[1].focus();
        return;
    }

    if (!isPasswordStrong(password)) {
        showInputError(inputs[2], 'Lozinka mora sadržati bar jedno veliko slovo i jedan broj.');
        inputs[2].focus();
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            alert(data.error || 'Neuspešna registracija.');
            return;
        }

        if (data.token) {
            setToken(data.token);
            window.location.href = '../index.html';
        } else {
            alert('Neuspešna registracija.');
        }
    } catch (err) {
        alert('Greška pri registraciji.');
    }
});
