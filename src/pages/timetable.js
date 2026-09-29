const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const TimetableView = {
    key(userId) {
        return 'campusflow_timetable_' + userId;
    },

    load(userId) {
        try { return JSON.parse(localStorage.getItem(this.key(userId)) || '[]'); }
        catch (_) { return []; }
    },

    save(userId, items) {
        localStorage.setItem(this.key(userId), JSON.stringify(items));
    },

    render(user) {
        const items = this.load(user.id);
        const byDay = Object.fromEntries(DAYS.map(d => [d, []]));
        items.forEach(item => { if (byDay[item.day]) byDay[item.day].push(item); });
        DAYS.forEach(d => byDay[d].sort((a,b) => a.time.localeCompare(b.time)));

        return `
            <div class="view-container timetable-page">
                <div class="timetable-header">
                    <div>
                        <h1>Class Timetable</h1>
                        <p class="text-muted">Keep your weekly class schedule in CampusFlow.</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.App.openTimetableForm()">
                        <i class="ph ph-plus"></i> Add Class
                    </button>
                </div>

                <div class="timetable-grid">
                    ${DAYS.map(day => `
                        <section class="timetable-day card">
                            <div class="timetable-day-head">
                                <div>
                                    <strong>${day}</strong>
                                    <span>${byDay[day].length} class${byDay[day].length === 1 ? '' : 'es'}</span>
                                </div>
                                <button class="icon-btn" title="Add class" onclick="window.App.openTimetableForm('${day}')">
                                    <i class="ph ph-plus"></i>
                                </button>
                            </div>
                            <div class="timetable-slots">
                                ${byDay[day].length ? byDay[day].map(item => this.renderItem(item)).join('') :
                                    '<div class="timetable-empty"><i class="ph ph-calendar-blank"></i><span>No classes</span></div>'}
                            </div>
                        </section>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderItem(item) {
        const id = this.escapeAttr(item.id);
        return `
            <article class="timetable-class">
                <div class="timetable-time">${this.escape(item.time)}</div>
                <div class="timetable-class-main">
                    <strong>${this.escape(item.subject)}</strong>
                    <span>${this.escape(item.teacher || 'Teacher not added')}</span>
                    <small><i class="ph ph-map-pin"></i> ${this.escape(item.room || 'Room not added')}</small>
                </div>
                <button class="icon-btn danger" title="Delete" onclick="window.App.deleteTimetableItem('${id}')">
                    <i class="ph ph-trash"></i>
                </button>
            </article>
        `;
    },

    escape(value) {
        const div = document.createElement('div');
        div.textContent = value ?? '';
        return div.innerHTML;
    },

    escapeAttr(value) {
        return String(value ?? '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }
};