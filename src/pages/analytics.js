export const AnalyticsView = {
    render({ classroom, resources, assignments, announcements, members, activity }) {
        const completed = Number(localStorage.getItem('campusflow_completed_assignments_' + classroom.id) || 0);
        const totalAssignments = assignments.length;
        const completion = totalAssignments ? Math.min(100, Math.round((completed / totalAssignments) * 100)) : 0;

        const last7 = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setHours(0,0,0,0);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });
        const counts = last7.map(day => {
            const next = new Date(day); next.setDate(next.getDate()+1);
            return activity.filter(a => {
                const t = new Date(a.created_at);
                return t >= day && t < next;
            }).length;
        });
        const max = Math.max(1, ...counts);

        return `
            <div class="view-container analytics-page">
                <div class="analytics-header">
                    <div>
                        <h1>Student Analytics</h1>
                        <p class="text-muted">Your activity overview for <strong>${this.escape(classroom.name)}</strong>.</p>
                    </div>
                    <span class="analytics-live"><i class="ph ph-chart-line-up"></i> Live classroom data</span>
                </div>

                <div class="analytics-stat-grid">
                    ${this.stat('Resources', resources.length, 'ph-books')}
                    ${this.stat('Assignments', assignments.length, 'ph-file-text')}
                    ${this.stat('Announcements', announcements.length, 'ph-megaphone')}
                    ${this.stat('Classmates', members.length, 'ph-users')}
                </div>

                <div class="analytics-columns">
                    <section class="card analytics-chart-card">
                        <div class="section-title">
                            <div><h3>Weekly Activity</h3><p class="text-muted">Classroom activity recorded during the last 7 days.</p></div>
                        </div>
                        <div class="activity-chart">
                            ${last7.map((day, i) => `
                                <div class="activity-bar-wrap">
                                    <span class="activity-value">${counts[i]}</span>
                                    <div class="activity-bar-track"><div class="activity-bar" style="height:${Math.max(8, Math.round(counts[i] / max * 100))}%"></div></div>
                                    <small>${day.toLocaleDateString(undefined,{weekday:'short'})}</small>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="card analytics-progress-card">
                        <h3>Assignment Progress</h3>
                        <p class="text-muted">Use the completion controls below to track your own progress.</p>
                        <div class="progress-ring" style="--progress:${completion}%">
                            <strong>${completion}%</strong><span>completed</span>
                        </div>
                        <div class="progress-row">
                            <span>Completed</span><strong>${completed}</strong>
                        </div>
                        <div class="progress-row">
                            <span>Remaining</span><strong>${Math.max(0,totalAssignments-completed)}</strong>
                        </div>
                        <button class="btn btn-primary w-full mt-4" onclick="window.App.toggleAssignmentProgress('${this.escapeAttr(classroom.id)}')">
                            <i class="ph ph-check-circle"></i> Update Progress
                        </button>
                    </section>
                </div>

                <section class="card analytics-list-card">
                    <div class="section-title">
                        <div><h3>Upcoming Assignments</h3><p class="text-muted">Deadlines currently listed by your host.</p></div>
                    </div>
                    ${assignments.length ? assignments.slice(0,6).map(a => `
                        <div class="analytics-assignment">
                            <div><span class="analytics-assignment-icon"><i class="ph ph-file-text"></i></span>
                            <div><strong>${this.escape(a.title)}</strong><small>${this.escape(a.subject || 'General')}</small></div></div>
                            <time>${a.due_date ? new Date(a.due_date + 'T00:00:00').toLocaleDateString() : 'No due date'}</time>
                        </div>
                    `).join('') : '<div class="analytics-empty">No assignments yet.</div>'}
                </section>
            </div>
        `;
    },

    stat(label, value, icon) {
        return `<div class="card analytics-stat"><span class="analytics-icon"><i class="ph ${icon}"></i></span><div><strong>${value}</strong><span>${label}</span></div></div>`;
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