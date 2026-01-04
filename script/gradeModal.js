window.currentSubjectId = null;
window.selectedGradeValue = null;

// Opening the modal for adding a grade
window.addGrade = function(id) {
    window.currentSubjectId = id;
    window.selectedGradeValue = null;
    
    const descriptionInput = document.getElementById('gradeDescription');
    if (descriptionInput) descriptionInput.value = '';
    
    // Reset modal
    document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('selected'));
   
    const modal = document.getElementById('gradeModal');
    if (modal) modal.style.display = 'flex';
};

window.closeGradeModal = function() {
    const modal = document.getElementById('gradeModal');
    if (modal) modal.style.display = 'none';
};

window.selectGrade = function(val) {
    window.selectedGradeValue = val;
   
    document.querySelectorAll('.grade-btn').forEach(btn => {
        if (parseInt(btn.innerText) === val) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
};