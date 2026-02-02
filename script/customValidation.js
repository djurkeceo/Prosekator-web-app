window.customConfirm = function(options) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';
        
        const iconType = options.type === 'danger' ? 'danger' : 'warning';
        const iconSymbol = options.type === 'danger' ? '!' : '?';
        
        overlay.innerHTML = `
            <div class="custom-confirm-box">
                <div class="custom-confirm-icon ${iconType}">
                    ${iconSymbol}
                </div>
                <div class="custom-confirm-title">${options.title || 'Potvrda'}</div>
                <div class="custom-confirm-message">${options.message || 'Da li ste sigurni?'}</div>
                <div class="custom-confirm-buttons">
                    <button class="custom-confirm-btn cancel">${options.cancelText || 'Otkaži'}</button>
                    <button class="custom-confirm-btn ${options.type === 'danger' ? 'danger' : 'confirm'}">${options.confirmText || 'Potvrdi'}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => overlay.classList.add('show'), 10);
        
        const cancelBtn = overlay.querySelector('.custom-confirm-btn.cancel');
        const confirmBtn = overlay.querySelector('.custom-confirm-btn.confirm, .custom-confirm-btn.danger');
        
        const closeModal = (result) => {
            overlay.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(result);
            }, 300);
        };
        
        cancelBtn.addEventListener('click', () => closeModal(false));
        confirmBtn.addEventListener('click', () => closeModal(true));
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(false);
            }
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal(false);
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    });
};