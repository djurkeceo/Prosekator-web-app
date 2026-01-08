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
   
    document.querySelectorAll('.grade-btn').forEach(btn => {
        if (parseInt(btn.innerText) === val) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
};

// Closing the menu if clicking anywhere outside the menu
document.addEventListener('click', (e) => {
    const modal = document.getElementById('gradeModal');
    const modalContent = document.querySelector('.modal-content');
    if (e.target === modal) {
        closeGradeModal();
    }
});