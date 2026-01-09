window.currentSubjectId = null;
window.selectedGradeValue = null;

window.addGrade = function(id) {
    window.currentSubjectId = id;
    window.selectedGradeValue = null;
    
    const descriptionInput = document.getElementById('gradeDescription');
    if (descriptionInput) descriptionInput.value = '';
    
    document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('selected'));
    
    const gradeSelection = document.getElementById('grade-selection');
    const gradeTooltip = gradeSelection.querySelector('.error-tooltip');
    const descriptionTooltip = descriptionInput.parentElement.querySelector('.error-tooltip');
    
    gradeTooltip.classList.remove('visible');
    gradeSelection.classList.remove('invalid-field');
    descriptionTooltip.classList.remove('visible');
    descriptionInput.classList.remove('invalid-field');
   
    const modal = document.getElementById('gradeModal');
    if (modal) {
        modal.classList.add('show');
    }
};

window.closeGradeModal = function() {
    const modal = document.getElementById('gradeModal');
    
    if (modal) {
        modal.classList.remove('show');
    }
};

window.selectGrade = function(val) {
    window.selectedGradeValue = val;
    
    const gradeSelection = document.getElementById('grade-selection');
    const tooltip = gradeSelection.querySelector('.error-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        gradeSelection.classList.remove('invalid-field');
    }
   
    document.querySelectorAll('.grade-btn').forEach(btn => {
        if (parseInt(btn.innerText) === val) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
};

document.addEventListener('click', (e) => {
    const modal = document.getElementById('gradeModal');
    if (e.target === modal) {
        closeGradeModal();
    }
});

document.getElementById('confirmGradeBtn').addEventListener('click', function() {
    const gradeSelection = document.getElementById('grade-selection');
    const gradeTooltip = gradeSelection.querySelector('.error-tooltip');
    const descriptionInput = document.getElementById('gradeDescription');
    const descriptionTooltip = descriptionInput.parentElement.querySelector('.error-tooltip');
    
    gradeTooltip.classList.remove('visible');
    gradeSelection.classList.remove('invalid-field');
    descriptionTooltip.classList.remove('visible');
    descriptionInput.classList.remove('invalid-field');
    
    let hasError = false;
    
    if (!window.selectedGradeValue) {
        setTimeout(() => {
            gradeTooltip.classList.add('visible');
            gradeSelection.classList.add('invalid-field');
        }, 10);
        hasError = true;
    }
    
    const description = descriptionInput.value.trim();
    if (!description) {
        setTimeout(() => {
            descriptionTooltip.classList.add('visible');
            descriptionInput.classList.add('invalid-field');
            if (!hasError) {
                descriptionInput.focus();
            }
        }, 10);
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
});

document.getElementById('gradeDescription').addEventListener('input', function() {
    const tooltip = this.parentElement.querySelector('.error-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        this.classList.remove('invalid-field');
    }
});