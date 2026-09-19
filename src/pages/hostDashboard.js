import { UI } from '../utils/ui.js';

export const HostDashboard = {
    renderClassrooms(classrooms) {
        if (classrooms.length === 0) {
            return `
                <div class="view-container flex flex-col items-center justify-center text-center py-16" style="max-width: 600px; margin: 0 auto;">
                    <div class="empty-state-icon" style="font-size: 4rem; color: var(--accent-primary); margin-bottom: 1rem;">🏫</div>
                    <h1 class="mb-2">Welcome to CampusFlow</h1>
                    <p class="text-muted mb-8 text-lg">You don't have any classrooms yet. Let's create your first one.</p>
                    <button class="btn btn-primary" onclick="window.App.Modals.showCreateClassroomModal()" style="padding: 1rem 2rem; font-size: 1.1rem;">
                        <i class="ph ph-plus"></i> Create Classroom
                    </button>
                </div>
            `;
        }

        const listHTML = classrooms.map(c => `
            <div class="card card-hoverable cursor-pointer mb-4 flex justify-between items-center" onclick="window.App.setActiveClassroom('${c.id}')" style="border-left: 4px solid var(--accent-primary);">
                <div>
                    <h3 class="m-0">${c.name}</h3>
                    <p class="text-sm text-muted m-0">${c.department || 'General'} • ${c.semester || ''} ${c.academic_year || ''}</p>
                </div>
                <i class="ph ph-caret-right text-muted text-xl"></i>
            </div>
        `).join('');

        return `
            <div class="view-container" style="max-width: 800px;">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="mb-1">My Classrooms</h1>
                        <p class="text-muted">Manage your digital classrooms</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.App.Modals.showCreateClassroomModal()">
                        <i class="ph ph-plus"></i> New Classroom
                    </button>
                </div>
                <div>
                    ${listHTML}
                </div>
            </div>
        `;
    },

    renderOverview(user, classroom, studentsCount, resourcesCount, assignmentsCount, announcementsCount, activity) {
        const recentActivity = activity.slice(0, 5);

        const activityHTML = recentActivity.map(a => `
            <div class="flex items-start gap-4 mb-4 pb-4" style="border-bottom: 1px solid var(--border-color);">
                <div class="text-muted" style="width: 60px; font-size: 0.8rem;">${new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>
                    <span class="font-medium">${a.profiles?.name || 'Someone'}</span> 
                    <span class="text-muted">${a.action}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="view-container">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="mb-1">${classroom.name}</h1>
                        <p class="text-muted">${classroom.department || 'General'} • Host Dashboard</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-outline" onclick="window.location.hash='#settings'"><i class="ph ph-gear"></i> Settings</button>
                    </div>
                </div>

                <div class="flex gap-4 mb-8 flex-wrap">
                    <div class="card text-center cursor-pointer card-hoverable" style="flex: 1; min-width: 150px;" onclick="window.location.hash='#members'">
                        <h2 style="font-size: 2.5rem; color: var(--accent-primary);">${studentsCount}</h2>
                        <p class="font-medium text-sm text-muted">Students</p>
                    </div>
                    <div class="card text-center cursor-pointer card-hoverable" style="flex: 1; min-width: 150px;" onclick="window.location.hash='#resources'">
                        <h2 style="font-size: 2.5rem; color: var(--accent-primary);">${resourcesCount}</h2>
                        <p class="font-medium text-sm text-muted">Resources</p>
                    </div>
                    <div class="card text-center cursor-pointer card-hoverable" style="flex: 1; min-width: 150px;" onclick="window.location.hash='#assignments'">
                        <h2 style="font-size: 2.5rem; color: var(--accent-primary);">${assignmentsCount}</h2>
                        <p class="font-medium text-sm text-muted">Assignments</p>
                    </div>
                    <div class="card text-center cursor-pointer card-hoverable" style="flex: 1; min-width: 150px;" onclick="window.location.hash='#announcements'">
                        <h2 style="font-size: 2.5rem; color: var(--accent-primary);">${announcementsCount}</h2>
                        <p class="font-medium text-sm text-muted">Announcements</p>
                    </div>
                </div>

                <div class="card" style="max-width: 800px;">
                    <h3 class="mb-6">Recent Activity</h3>
                    ${activityHTML || '<p class="text-muted">No recent activity.</p>'}
                </div>
            </div>
        `;
    },

    renderStudents(members) {
        let stuHTML = members.map(m => `
            <div class="flex items-center justify-between p-4 border-b" style="border-bottom: 1px solid var(--border-color);">
                <div class="flex items-center gap-4" style="flex: 1;">
                    <div class="avatar-sm">${m.profiles.name.substring(0,2).toUpperCase()}</div>
                    <div>
                        <h4 class="m-0">${m.profiles.name}</h4>
                        <span class="text-xs text-muted">${m.profiles.student_id || 'N/A'}</span>
                    </div>
                </div>
                <div class="text-sm text-muted hidden md-block" style="flex: 1;">${m.profiles.email}</div>
                <div class="text-sm font-medium" style="flex: 1; color: var(--success);">● ${m.status}</div>
                <div class="flex gap-2">
                    <button class="btn btn-outline btn-sm text-danger" onclick="window.App.Modals.showRemoveStudentModal('${m.user_id}', '${m.profiles.name}')">Remove</button>
                </div>
            </div>
        `).join('');

        if (members.length === 0) {
            stuHTML = `
                <div class="empty-state w-full">
                    <div class="empty-state-icon">👥</div>
                    <h3>No students yet</h3>
                    <p class="mb-4">Add your first student to the classroom.</p>
                    <button class="btn btn-primary" onclick="window.App.Modals.showAddStudentModal()">+ Add Student</button>
                </div>
            `;
        }

        return `
            <div class="view-container">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="mb-1">Members</h1>
                        <p class="text-muted">${members.length} students</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.App.Modals.showAddStudentModal()">
                        <i class="ph ph-plus"></i> Add Student
                    </button>
                </div>

                <div class="card p-0" style="overflow: hidden; max-width: 1000px;">
                    ${stuHTML}
                </div>
            </div>
            <style>
                @media (min-width: 768px) { .md-block { display: block !important; } }
                .md-block { display: none; }
            </style>
        `;
    },
    
    renderSettings(classroom) {
        return `
            <div class="view-container" style="max-width: 800px;">
                <h1 class="mb-8">Classroom Settings</h1>
                
                <div class="card mb-6">
                    <h3 class="mb-4">General Details</h3>
                    <form onsubmit="window.App.handleUpdateClassroom(event, '${classroom.id}')">
                        <div class="form-group mb-4">
                            <label class="form-label">Classroom Name</label>
                            <input type="text" id="cs-name" class="form-input" value="${classroom.name}" required>
                        </div>
                        <div class="form-group mb-4">
                            <label class="form-label">Description</label>
                            <textarea id="cs-desc" class="form-input">${classroom.description || ''}</textarea>
                        </div>
                        <div class="form-group mb-4">
                            <label class="form-label">Department</label>
                            <input type="text" id="cs-dept" class="form-input" value="${classroom.department || ''}">
                        </div>
                        <div class="form-group mb-4">
                            <label class="form-label">Institution</label>
                            <input type="text" id="cs-inst" class="form-input" value="${classroom.institution || ''}">
                        </div>
                        <div class="flex flex-col-mobile gap-4 mb-6">
                            <div class="form-group" style="flex: 1;">
                                <label class="form-label">Semester</label>
                                <input type="text" id="cs-sem" class="form-input" value="${classroom.semester || ''}">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label class="form-label">Academic Year</label>
                                <input type="text" id="cs-year" class="form-input" value="${classroom.academic_year || ''}">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-full">Save Changes</button>
                    </form>
                </div>

                <div class="card mb-6" style="border: 1px solid var(--danger); background: rgba(239, 68, 68, 0.05);">
                    <h3 class="mb-2 text-danger">Danger Zone</h3>
                    <p class="text-sm text-muted mb-4">Actions here are permanent and cannot be undone.</p>
                    
                    <div class="flex flex-col-mobile items-start gap-4 justify-between py-4 border-t border-b" style="border-color: rgba(239, 68, 68, 0.2);">
                        <div>
                            <h4 class="m-0 text-base">Clear Activity History</h4>
                            <p class="text-sm text-muted m-0">Permanently remove all activity logs.</p>
                        </div>
                        <button class="btn btn-outline text-danger" onclick="window.App.Modals.showClearActivityModal('${classroom.id}')">Clear History</button>
                    </div>

                    <div class="flex flex-col-mobile items-start gap-4 justify-between py-4">
                        <div>
                            <h4 class="m-0 text-base">Delete Classroom</h4>
                            <p class="text-sm text-muted m-0">Permanently delete this classroom and all its data.</p>
                        </div>
                        <button class="btn btn-primary" style="background: var(--danger);" onclick="window.App.Modals.showDeleteClassroomModal('${classroom.id}', '${classroom.name}')">Delete Classroom</button>
                    </div>
                </div>
            </div>
        `;
    }
};
