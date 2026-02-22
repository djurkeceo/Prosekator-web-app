const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmailValid(email) {
    return emailRegex.test(String(email || '').trim());
}

function isPasswordStrong(password) {
    const value = String(password || '');
    return /[A-Z]/.test(value) && /[0-9]/.test(value);
}

module.exports = { isEmailValid, isPasswordStrong };
