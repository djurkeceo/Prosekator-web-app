window.currentSubjectId = null;
window.selectedGradeValue = null;
window.currentGradeIndex = null;
window.isEditMode = false;
window.originalGradeValue = null;
window.originalDescription = null;

window.addGrade = function(id) {
    window.currentSubjectId = id;
    window.selectedGradeValue = null;
    window.currentGradeIndex = null;
    window.isEditMode = false;
    window.originalGradeValue = null;
    window.originalDescription = null;
    
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
    
    document.querySelector('.modalMainTitle').innerText = 'Dodaj Ocenu';
    document.getElementById('confirmGradeBtn').innerText = 'Dodaj ocenu';
    
    const existingDeleteBtn = document.getElementById('deleteGradeBtn');
    if (existingDeleteBtn) {
        existingDeleteBtn.remove();
    }
    
    const modal = document.getElementById('gradeModal');
    if (modal) {
        modal.classList.add('show');
    }
};

window.editGrade = function(subjectId, gradeIndex) {
    window.currentSubjectId = subjectId;
    window.currentGradeIndex = gradeIndex;
    window.isEditMode = true;
    
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject || !subject.grades[gradeIndex]) return;
    
    const grade = subject.grades[gradeIndex];
    window.selectedGradeValue = grade.value;
    window.originalGradeValue = grade.value;
    window.originalDescription = grade.description;
    
    const descriptionInput = document.getElementById('gradeDescription');
    if (descriptionInput) descriptionInput.value = grade.description;
    
    document.querySelectorAll('.grade-btn').forEach(btn => {
        if (parseInt(btn.innerText) === grade.value) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    const gradeSelection = document.getElementById('grade-selection');
    const gradeTooltip = gradeSelection.querySelector('.error-tooltip');
    const descriptionTooltip = descriptionInput.parentElement.querySelector('.error-tooltip');
    
    gradeTooltip.classList.remove('visible');
    gradeSelection.classList.remove('invalid-field');
    descriptionTooltip.classList.remove('visible');
    descriptionInput.classList.remove('invalid-field');
    
    document.querySelector('.modalMainTitle').innerText = 'Izmeni Ocenu';
    document.getElementById('confirmGradeBtn').innerText = 'Sačuvaj izmene';
    
    const existingDeleteBtn = document.getElementById('deleteGradeBtn');
    if (existingDeleteBtn) {
        existingDeleteBtn.remove();
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteGradeBtn';
    deleteBtn.className = 'delete-grade-btn';
    deleteBtn.innerText = 'Obriši ocenu';
    deleteBtn.onclick = function() {
        if (confirm('Da li ste sigurni da želite da obrišete ovu ocenu?')) {
            const subject = subjects.find(s => s.id === window.currentSubjectId);
            if (subject) {
                subject.grades.splice(window.currentGradeIndex, 1);
                
                if (subject.grades.length > 0) {
                    const sum = subject.grades.reduce((acc, g) => acc + g.value, 0);
                    subject.average = sum / subject.grades.length;
                } else {
                    subject.average = 0;
                }
                
                renderSubjects();
                calculateOverall();
                closeGradeModal();
            }
        }
    };
    
    const confirmBtn = document.getElementById('confirmGradeBtn');
    confirmBtn.parentNode.insertBefore(deleteBtn, confirmBtn.nextSibling);
    
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
    
    const subject = subjects.find(s => s.id === window.currentSubjectId);
    if (!subject) return;
    
    if (window.isEditMode) {
        const hasChanges = window.selectedGradeValue !== window.originalGradeValue || 
                          description !== window.originalDescription;
        
        if (hasChanges) {
            const confirmMessage = 'Da li ste sigurni da želite da sačuvate izmene?';
            if (!confirm(confirmMessage)) {
                return;
            }
        }
        
        subject.grades[window.currentGradeIndex] = {
            value: window.selectedGradeValue,
            description: description
        };
    } else {
        subject.grades.push({
            value: window.selectedGradeValue,
            description: description
        });
    }
    
    const sum = subject.grades.reduce((acc, g) => acc + g.value, 0);
    subject.average = sum / subject.grades.length;
    
    renderSubjects();
    calculateOverall();
    closeGradeModal();
});

document.getElementById('gradeDescription').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('confirmGradeBtn').click();
    }
});

document.getElementById('gradeDescription').addEventListener('input', function() {
    const tooltip = this.parentElement.querySelector('.error-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        this.classList.remove('invalid-field');
    }
});