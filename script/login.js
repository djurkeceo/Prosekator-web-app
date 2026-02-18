const AUTH_TOKEN_KEY = 'prosekatorAuthToken';

function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

document.querySelector('.loginFormMain').addEventListener('submit', async function (e) {
    let inputs = this.querySelectorAll('input[required]');
    let firstInvalid = null;
    let hasError = false;

    inputs.forEach(input => {
        const tooltip = input.parentElement.querySelector('.error-tooltip');
        
        if (!input.value.trim()) {
            e.preventDefault();
            hasError = true;
            
            tooltip.classList.add('visible');
            input.classList.add('invalid-field');

            if (!firstInvalid) firstInvalid = input;

            input.addEventListener('input', () => {
                tooltip.classList.remove('visible');
                input.classList.remove('invalid-field');
            }, { once: true });
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    if (hasError) return;

    e.preventDefault();

    const email = inputs[0] ? inputs[0].value.trim() : '';
    const password = inputs[1] ? inputs[1].value : '';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            alert(data.error || 'Neuspešna prijava.');
            return;
        }

        if (data.token) {
            setToken(data.token);
            window.location.href = '../index.html';
        } else {
            alert('Neuspešna prijava.');
        }
    } catch (err) {
        alert('Greška pri prijavi.');
    }
});
