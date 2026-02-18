/* ── Stats updater — call this whenever grades change ── */
    function updateStats() {
        // Gather all grade badges from DOM
        const allBadges = document.querySelectorAll('.grade-badge');
        const grades = [];
        allBadges.forEach(b => {
            const val = parseInt(b.textContent.trim());
            if (!isNaN(val)) grades.push(val);
        });

        const total = grades.length;

        document.getElementById('statTotal').textContent = total;

        if (total === 0) {
            document.getElementById('statBest').textContent = '—';
            document.getElementById('statWorst').textContent = '—';
            document.getElementById('statTopSubject').textContent = '—';
            document.getElementById('trendSection').style.display = 'none';
            document.getElementById('trendBadge').textContent = 'Nema podataka';
            document.getElementById('trendBadge').className = 'trend-badge flat';
            return;
        }

        document.getElementById('trendSection').style.display = 'block';

        // Best / worst grade
        const best = Math.max(...grades);
        const worst = Math.min(...grades);
        document.getElementById('statBest').textContent = best;
        document.getElementById('statWorst').textContent = worst;

        // Best subject by avg
        const cards = document.querySelectorAll('.subject-card');
        let topName = '—', topAvg = -Infinity;
        cards.forEach(card => {
            const avgEl = card.querySelector('.sub-avg-val');
            const nameEl = card.querySelector('.subject-info h3');
            if (!avgEl || !nameEl) return;
            const avg = parseFloat(avgEl.textContent);
            if (!isNaN(avg) && avg > topAvg) {
                topAvg = avg;
                topName = nameEl.textContent.trim();
            }
        });

        const topSubjectEl = document.getElementById('statTopSubject');
        if (topAvg >= 0 && topName !== '—') {
            const shortName = topName.length > 6 ? topName.slice(0, 5) + '…' : topName;
            topSubjectEl.textContent = shortName;

            // Add tooltip with full name
            topSubjectEl.title = '';
            let wrapper = document.getElementById('statTopSubjectWrapper');
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.id = 'statTopSubjectWrapper';
                wrapper.style.cssText = 'position:relative;display:inline-block;cursor:default;';
                topSubjectEl.parentNode.insertBefore(wrapper, topSubjectEl);
                wrapper.appendChild(topSubjectEl);

                const tooltip = document.createElement('span');
                tooltip.className = 'subject-full-tooltip';
                wrapper.appendChild(tooltip);
            }
            wrapper.querySelector('.subject-full-tooltip').textContent = topName;
        } else {
            topSubjectEl.textContent = '—';
        }

        // Distribution
        const counts = [0,0,0,0,0];
        grades.forEach(g => { if (g >= 1 && g <= 5) counts[g-1]++; });
        for (let i = 1; i <= 5; i++) {
            document.getElementById('dist' + i).style.flex = counts[i-1];
            document.getElementById('leg'  + i).textContent = `Ocena ${i} (${counts[i-1]})`;
        }

        // Trend badge — compare avg of last half vs first half
        if (grades.length >= 2) {
            const mid = Math.floor(grades.length / 2);
            const firstHalf = grades.slice(0, mid);
            const lastHalf  = grades.slice(mid);
            const avgFirst = firstHalf.reduce((a,b) => a+b, 0) / firstHalf.length;
            const avgLast  = lastHalf.reduce((a,b)  => a+b, 0) / lastHalf.length;
            const badge = document.getElementById('trendBadge');
            if (avgLast > avgFirst + 0.1) {
                badge.textContent = '↑ Napredak';
                badge.className = 'trend-badge up';
            } else if (avgLast < avgFirst - 0.1) {
                badge.textContent = '↓ Pad';
                badge.className = 'trend-badge down';
            } else {
                badge.textContent = '→ Stabilan';
                badge.className = 'trend-badge flat';
            }
        }
    }

    // Observe DOM changes so stats refresh automatically
    const observer = new MutationObserver(updateStats);
    observer.observe(document.getElementById('subjectsContainer'), {
        childList: true, subtree: true, characterData: true
    });