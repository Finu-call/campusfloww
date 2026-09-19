import { UI } from '../utils/ui.js';

export const StudentDashboard = {
    renderClassrooms(classrooms) {
        if (classrooms.length === 0) {
            return `
                <div class="view-container flex flex-col items-center justify-center text-center py-16" style="max-width: 600px; margin: 0 auto;">
                    <div class="empty-state-icon" style="font-size: 4rem; color: var(--accent-primary); margin-bottom: 1rem;">🏫</div>
                    <h1 class="mb-2">No Classrooms Yet</h1>
                    <p class="text-muted mb-8 text-lg">You haven't been added to any classrooms. Your host will add you when your class is ready.</p>
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
                <div class="mb-8">
                    <h1 class="mb-1">My Classrooms</h1>
                    <p class="text-muted">Select a classroom to view its contents</p>
                </div>
                <div>
                    ${listHTML}
                </div>
            </div>
        `;
    },

    renderOverview(user, classroom, resources, assignments, announcements, membersCount) {
        const recentResources = resources.slice(0, 3).map(r => `
            <div class="flex items-center justify-between p-3 border-b" style="border-bottom: 1px solid var(--border-color);">
                <div class="flex items-center gap-3">
                    <span style="font-size: 1.5rem;">${UI.getFileIcon(r.file_type)}</span>
                    <div>
                        <h4 class="text-sm m-0">${r.title}</h4>
                        <span class="text-xs text-muted">Uploaded by ${r.profiles?.name || 'Someone'} • ${new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                ${r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" download class="btn btn-ghost btn-sm"><i class="ph ph-download-simple"></i></a>` : ''}
            </div>
        `).join('');

        return `
            <div class="view-container">
                <div class="mb-8">
                    <h1 class="mb-1">Good morning, ${user.name.split(' ')[0]} 👋</h1>
                    <p class="text-muted">Welcome to ${classroom.name}.</p>
                </div>

                <div class="flex gap-4 mb-8" style="flex-wrap: wrap;">
                    <div class="card flex items-center gap-4 cursor-pointer card-hoverable" style="flex: 1; min-width: 200px;" onclick="window.location.hash='#resources'">
                        <div style="background: var(--accent-light); padding: 1rem; border-radius: 50%;">
                            <i class="ph ph-books text-xl" style="color: var(--accent-primary); font-size: 1.5rem;"></i>
                        </div>
                        <div>
                            <h3 class="m-0">${resources.length}</h3>
                            <p class="text-sm text-muted">Resources</p>
                        </div>
                    </div>
                    <div class="card flex items-center gap-4 cursor-pointer card-hoverable" style="flex: 1; min-width: 200px;" onclick="window.location.hash='#assignments'">
                        <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 50%;">
                            <i class="ph ph-file-text text-xl" style="color: var(--warning); font-size: 1.5rem;"></i>
                        </div>
                        <div>
                            <h3 class="m-0">${assignments.length}</h3>
                            <p class="text-sm text-muted">Pending Tasks</p>
                        </div>
                    </div>
                    <div class="card flex items-center gap-4 cursor-pointer card-hoverable" style="flex: 1; min-width: 200px;" onclick="window.location.hash='#announcements'">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 50%;">
                            <i class="ph ph-megaphone text-xl" style="color: var(--success); font-size: 1.5rem;"></i>
                        </div>
                        <div>
                            <h3 class="m-0">${announcements.length}</h3>
                            <p class="text-sm text-muted">Announcements</p>
                        </div>
                    </div>
                    <div class="card flex items-center gap-4 cursor-pointer card-hoverable" style="flex: 1; min-width: 200px;" onclick="window.location.hash='#members'">
                        <div style="background: var(--accent-light); padding: 1rem; border-radius: 50%;">
                            <i class="ph ph-users text-xl" style="color: var(--accent-primary); font-size: 1.5rem;"></i>
                        </div>
                        <div>
                            <h3 class="m-0">${membersCount}</h3>
                            <p class="text-sm text-muted">Classmates</p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-6" style="flex-wrap: wrap;">
                    <div style="flex: 2; min-width: 300px;">
                        <h3 class="mb-4">Recent Resources</h3>
                        <div class="card p-0" style="overflow: hidden;">
                            ${recentResources || '<div class="p-4 text-center text-muted">No recent resources.</div>'}
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 250px;">
                        <div class="card p-4">
                            <button class="btn btn-primary w-full mb-4" onclick="window.App.Modals.showUploadModal()">
                                <i class="ph ph-upload-simple"></i> Upload Resource
                            </button>
                            <button class="btn btn-outline w-full text-danger" onclick="window.App.Modals.showLeaveClassroomModal('${classroom.id}', '${classroom.name}')">
                                Leave Classroom
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderProfile(user) {
        return `
            <div class="view-container" style="max-width: 600px;">
                <h1 class="mb-8">My Profile</h1>
                
                <div class="card mb-8">
                    <div class="flex items-center gap-6 mb-6">
                        <div class="avatar-lg">${user.name.substring(0,2).toUpperCase()}</div>
                        <div>
                            <h2 class="mb-1">${user.name}</h2>
                            <p class="text-muted">${user.email}</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-4">
                        <div class="flex justify-between border-b pb-2" style="border-bottom: 1px solid var(--border-color);">
                            <span class="text-muted">Student ID</span>
                            <span class="font-medium">${user.studentId || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted">Role</span>
                            <span class="font-medium" style="text-transform: capitalize;">${user.role}</span>
                        </div>
                    </div>
                </div>

                <div class="card mb-8">
                    <h3 class="mb-4">Danger Zone</h3>
                    <button class="btn btn-primary" style="background: var(--danger); width: 100%;" onclick="window.App.Modals.showDeleteAccountModal()">Delete My Account</button>
                </div>
            </div>
        `;
    }
};
