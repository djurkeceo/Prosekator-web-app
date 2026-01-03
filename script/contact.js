document.querySelector('.contactFormMain').addEventListener('submit', function (e) {
    // Proveri da li tvoja textarea u HTML-u ima atribut 'required'
    let inputs = this.querySelectorAll('input[required], textarea[required]');
    let firstInvalid = null;

    inputs.forEach(input => {
        const tooltip = input.parentElement.querySelector('.error-tooltip');
        
        if (!input.value.trim()) {
            e.preventDefault();
            
            if (tooltip) tooltip.classList.add('visible');
            input.classList.add('invalid-field');

            if (!firstInvalid) firstInvalid = input;

            input.addEventListener('input', function() {
                if (tooltip) tooltip.classList.remove('visible');
                this.classList.remove('invalid-field');
            }, { once: true });
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();
    }
});