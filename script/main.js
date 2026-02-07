var availableColors = [
    "#B4D63D", 
    "#0055ffff", 
    "#FF007F", 
    "#fbff00ff", 
    "#ff0000ff", 
    "#0dff00ff", 
    "#f6a800ff", 
    "#9400D3", 
    "#00BFFF", 
    "#FF1493", 
    "#0a7700ff", 
    "#5a0036ff", 
    "#FF3131", 
    "#1F51FF", 
    "#BC13FE", 
    "#0FF0FC", 
    "#7FFF00", 
    "#FF00FF", 
    "#4D4DFF", 
    "#FFFF33", 
    "#08FF08", 
    "#FF6EC7", 
    "#00E5FF", 
    "#FF9933", 
    "#B57EDC", 
    "#FFCC33", 
    "#2EEAD3", 
    "#FF44CC", 
    "#9DFF00", 
    "#66FFFF"
];

let subjects = [];

document.getElementById('addSubjectBtn').addEventListener('click', function() {
    const input = document.getElementById('subjectName');
    const tooltip = input.parentElement.querySelector('.error-tooltip');
    const name = input.value.trim();

    tooltip.classList.remove('visible');
    input.classList.remove('invalid-field');

    if (!name) {
        setTimeout(() => {
            tooltip.classList.add('visible');
            input.classList.add('invalid-field');
            input.focus();
        }, 10);
        return;
    }

    if (availableColors.length === 0) {
        alert("No more colors available!");
        return;
    }

    const subjectColor = availableColors.shift();
    const newSubject = {
        id: Date.now(),
        name: name,
        grades: [],
        average: 0,
        color: subjectColor
    };

    subjects.push(newSubject);
    input.value = '';
    renderSubjects();
    calculateOverall();
});

document.getElementById('subjectName').addEventListener('input', function() {
    const tooltip = this.parentElement.querySelector('.error-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        this.classList.remove('invalid-field');
    }
});

document.getElementById('subjectName').addEventListener('input', function() {
    const tooltip = this.parentElement.querySelector('.error-tooltip-grade');
    if (tooltip) {
        tooltip.classList.remove('visible');
        this.classList.remove('invalid-field');
    }
});

document.getElementById('subjectName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') document.getElementById('addSubjectBtn').click();
});

window.deleteSubject = async function(id, event) {
    if (event) event.stopPropagation();

    const subject = subjects.find(s => s.id === id);
    if (!subject) return;
    
    const confirmed = await customConfirm({
        title: 'Brisanje predmeta',
        message: `Da li ste sigurni da želite da obrišete predmet "${subject.name}"?${subject.grades.length > 0 ? ` Brisanjem predmeta ćete obrisati i sve ocene (${subject.grades.length}).` : ''}`,
        confirmText: 'Obriši',
        cancelText: 'Otkaži',
        type: 'danger'
    });
    
    if (!confirmed) return;

    const card = document.querySelector(`.subject-card[data-id="${id}"]`);
    if (card) {
        card.classList.add('removing');
        setTimeout(() => {
            const index = subjects.findIndex(s => s.id === id);
            if (index !== -1) {
                availableColors.unshift(subjects[index].color);
                subjects.splice(index, 1);
                card.remove(); 
                calculateOverall();
                if (subjects.length === 0) renderSubjects();
            }
        }, 400); 
    }
};

function calculateOverall() {
    const subjectsWithGrades = subjects.filter(sub => sub.grades.length > 0);
    
    if (subjectsWithGrades.length === 0) {
        document.getElementById('finalAverage').innerText = "0.00";
        return;
    }
    
    const sum = subjectsWithGrades.reduce((acc, sub) => acc + sub.average, 0);
    const overall = sum / subjectsWithGrades.length;
    
    document.getElementById('finalAverage').innerText = overall.toFixed(2);
}

function renderSubjects() {
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';
    subjects.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'subject-card';
        div.setAttribute('data-id', sub.id);
        div.style.setProperty('--subject-color', sub.color);
        
        const gradeBadgesHTML = sub.grades.map((g, index) => {
            return `<span class="grade-badge" onclick="editGrade(${sub.id}, ${index})" style="--subject-color: ${sub.color}">
                ${g.value}
                <span class="grade-tooltip">${g.description}</span>
            </span>`;
        }).join('');
        
        div.innerHTML = `
            <div class="subject-info">
                <h3>${sub.name}</h3>
                <div class="grades-wrapper">
                    ${gradeBadgesHTML}
                    <button class="add-grade-btn" onclick="addGrade(${sub.id})">+</button>
                </div>
            </div>
            <div class="subject-right">
                <button class="delete-subject-btn" onclick="deleteSubject(${sub.id}, event)">&times;</button>
                <div class="sub-avg-val">${sub.average > 0 ? sub.average.toFixed(2) : "---"}</div>
            </div>
        `;
        container.appendChild(div);
    });
}