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

const baseColors = [...availableColors];
const AUTH_TOKEN_KEY = 'prosekatorAuthToken';

let subjects = [];

function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

function handleAuthExpired() {
    clearToken();
    window.location.href = './docs/login.html';
}

const API_BASE_URL = 'http://localhost:3000';

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = Object.assign({
        'Content-Type': 'application/json'
    }, options.headers || {});

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, Object.assign({}, options, { headers }));

    if (response.status === 401 || response.status === 403) {
        handleAuthExpired();
        throw new Error('Unauthorized');
    }

    return response;
}

function saveToLocalStorage() {
    localStorage.setItem('prosekatorSubjects', JSON.stringify(subjects));
    localStorage.setItem('prosekatorColors', JSON.stringify(availableColors));
}

function loadFromLocalStorage() {
    const savedSubjects = localStorage.getItem('prosekatorSubjects');
    const savedColors = localStorage.getItem('prosekatorColors');
    
    if (savedSubjects) {
        const parsed = JSON.parse(savedSubjects);
        subjects = parsed.map((sub) => ({
            id: String(sub.id),
            name: sub.name,
            grades: Array.isArray(sub.grades) ? sub.grades : [],
            average: sub.average || 0,
            color: sub.color || null
        }));
        renderSubjects();
        calculateOverall();
    }
    
    if (savedColors) {
        availableColors = JSON.parse(savedColors);
    }
}

function resetColorsForSubjects() {
    availableColors = [...baseColors];
    subjects.forEach((sub) => {
        if (!sub.color) {
            sub.color = availableColors.shift() || '#B4D63D';
        } else {
            const idx = availableColors.indexOf(sub.color);
            if (idx >= 0) {
                availableColors.splice(idx, 1);
            }
        }
    });
}

function normalizeServerSubjects(serverSubjects) {
    const normalized = (serverSubjects || []).map((sub) => {
        const grades = Array.isArray(sub.grades) ? sub.grades.map((g) => ({
            value: Number(g),
            description: ''
        })) : [];

        const avg = grades.length > 0
            ? grades.reduce((acc, g) => acc + g.value, 0) / grades.length
            : 0;

        return {
            id: String(sub._id || sub.id),
            name: sub.name,
            grades,
            average: avg,
            color: null
        };
    });

    return normalized;
}

async function loadFromServer() {
    try {
        const response = await authFetch('/api/user/data');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        const data = await response.json();
        subjects = normalizeServerSubjects(data.subjects);
        resetColorsForSubjects();
        renderSubjects();
        calculateOverall();
        saveToLocalStorage();
    } catch (err) {
        loadFromLocalStorage();
    }
}

async function createSubjectOnServer(name) {
    const response = await authFetch('/api/user/subjects', {
        method: 'POST',
        body: JSON.stringify({ name })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to add subject' }));
        throw new Error(error.error || 'Failed to add subject');
    }

    const data = await response.json();
    return data.subject;
}

async function deleteSubjectOnServer(subjectId) {
    const response = await authFetch(`/api/user/subjects/${subjectId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete subject' }));
        throw new Error(error.error || 'Failed to delete subject');
    }
}

async function syncSubjectGrades(subjectId) {
    const token = getToken();
    if (!token) return;

    const subject = subjects.find((s) => s.id === String(subjectId));
    if (!subject) return;

    const grades = subject.grades.map((g) => Number(g.value)).filter((g) => Number.isFinite(g));

    await authFetch('/api/user/grades', {
        method: 'POST',
        body: JSON.stringify({ subjectId: subject.id, grades })
    });
}

window.syncSubjectGrades = syncSubjectGrades;

window.addEventListener('DOMContentLoaded', function() {
    if (getToken()) {
        loadFromServer();
    } else {
        loadFromLocalStorage();
    }
});

document.getElementById('addSubjectBtn').addEventListener('click', async function() {
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

    let subjectId = String(Date.now());

    if (getToken()) {
        try {
            const created = await createSubjectOnServer(name);
            subjectId = String(created._id || created.id || subjectId);
        } catch (err) {
            alert(err.message || 'Neuspešno dodavanje predmeta.');
            return;
        }
    }

    const subjectColor = availableColors.shift();
    const newSubject = {
        id: subjectId,
        name: name,
        grades: [],
        average: 0,
        color: subjectColor
    };

    subjects.push(newSubject);
    input.value = '';
    renderSubjects();
    calculateOverall();
    saveToLocalStorage();
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

    const subject = subjects.find(s => s.id === String(id));
    if (!subject) return;
    
    const confirmed = await customConfirm({
        title: 'Brisanje predmeta',
        message: `Da li ste sigurni da želite da obrišete predmet "${subject.name}"?${subject.grades.length > 0 ? ` Brisanjem predmeta ćete obrisati i sve ocene (${subject.grades.length}).` : ''}`,
        confirmText: 'Obriši',
        cancelText: 'Otkaži',
        type: 'danger'
    });
    
    if (!confirmed) return;

    if (getToken()) {
        try {
            await deleteSubjectOnServer(subject.id);
        } catch (err) {
            alert(err.message || 'Neuspešno brisanje predmeta.');
            return;
        }
    }

    const card = document.querySelector(`.subject-card[data-id="${id}"]`);
    if (card) {
        card.classList.add('removing');
        setTimeout(() => {
            const index = subjects.findIndex(s => s.id === String(id));
            if (index !== -1) {
                availableColors.unshift(subjects[index].color);
                subjects.splice(index, 1);
                card.remove(); 
                calculateOverall();
                saveToLocalStorage();
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
    
    const sum = subjectsWithGrades.reduce((acc, sub) => acc + Math.round(sub.average), 0);
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

        const safeId = String(sub.id).replace(/'/g, "\\'");
        
        const gradeBadgesHTML = sub.grades.map((g, index) => {
            const value = typeof g === 'number' ? g : g.value;
            const description = typeof g === 'object' && g !== null ? (g.description || '') : '';
            return `<span class="grade-badge" onclick="editGrade('${safeId}', ${index})" style="--subject-color: ${sub.color}">
                ${value}
                <span class="grade-tooltip">${description}</span>
            </span>`;
        }).join('');
        
        div.innerHTML = `
            <div class="subject-info">
                <h3>${sub.name}</h3>
                <div class="grades-wrapper">
                    ${gradeBadgesHTML}
                    <button class="add-grade-btn" onclick="addGrade('${safeId}')">+</button>
                </div>
            </div>
            <div class="subject-right">
                <button class="delete-subject-btn" onclick="deleteSubject('${safeId}', event)">&times;</button>
                <div class="sub-avg-val">${sub.average > 0 ? sub.average.toFixed(2) : "---"}</div>
            </div>
        `;
        container.appendChild(div);
    });
}
