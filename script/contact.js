document.querySelector('.contactFormMain').addEventListener('submit', function (e) {
    let inputs = this.querySelectorAll('input[required]', 'textarea[required]');
    let firstInvalid = null;

    inputs.forEach(input => {
        const tooltip = input.parentElement.querySelector('.error-tooltip');
        
        if (!input.value.trim()) {
            e.preventDefault();
            
            tooltip.classList.add('visible');
            input.classList.add('invalid-field');

            if (!firstInvalid) firstInvalid = input;

            input.addEventListener('input', () => {
                tooltip.classList.remove('visible');
                input.classList.remove('invalid-field');
            }, { once: true });
        }
    });

    if (firstInvalid) firstInvalid.focus();
});