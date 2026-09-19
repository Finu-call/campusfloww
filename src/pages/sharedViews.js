import { UI } from '../utils/ui.js';

export const SharedViews = {
    renderResources(resources, isHost, currentUserId) {
        let resHTML = resources.map(r => `
            <div class="card card-hoverable resource-card" data-category="${r.category}" style="width: 100%; max-width: 300px;">
                <div class="flex items-start justify-between mb-4">
                    <span style="font-size: 2rem;">${UI.getFileIcon(r.file_type)}</span>
                    <span class="text-xs text-muted bg-tertiary px-2 py-1 rounded" style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px;">${r.file_size}</span>
                </div>
                <h4 class="mb-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.title}</h4>
                <p class="text-xs text-muted mb-3">${r.subject}</p>
                <div class="flex items-center justify-between mt-auto pt-3" style="border-top: 1px solid var(--border-color);">
                    <span class="text-xs text-muted">By ${r.profiles?.name || 'Someone'}</span>
                    <div class="flex gap-2">
                        ${(isHost || r.uploaded_by === currentUserId) ? `<button class="btn btn-ghost btn-sm text-danger" onclick="window.App.Modals.showDeleteResourceModal('${r.id}', '${r.title}', '${r.file_path}')"><i class="ph ph-trash"></i></button>` : ''}
                        ${r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" download class="btn btn-primary btn-sm"><i class="ph ph-download-simple"></i> Download</a>` : '<button class="btn btn-ghost btn-sm disabled">Link Expired</button>'}
                    </div>
                </div>
            </div>
        `).join('');

        if (resources.length === 0) {
            resHTML = `
                <div class="empty-state w-full" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📚</div>
                    <h3>No resources found</h3>
                    <p class="mb-4">Be the first to upload a note.</p>
                </div>
            `;
        }

        return `
            <div class="view-container">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="mb-1">Resources</h1>
                    </div>
                    <button class="btn btn-primary" onclick="window.App.Modals.showUploadModal()">
                        <i class="ph ph-upload-simple"></i> Upload Resource
                    </button>
                </div>

                <div class="search-input-wrapper mb-6">
                    <i class="ph ph-magnifying-glass"></i>
                    <input type="text" id="resource-search" class="form-input search-input" placeholder="Search resources...">
                </div>

                <div class="tabs">
                    <div class="tab active" data-category="All" onclick="window.App.filterResources('All', this)">All</div>
                    <div class="tab" data-category="Notes" onclick="window.App.filterResources('Notes', this)">Notes</div>
                    <div class="tab" data-category="PDFs" onclick="window.App.filterResources('PDFs', this)">PDFs</div>
                    <div class="tab" data-category="Images" onclick="window.App.filterResources('Images', this)">Images</div>
                    <div class="tab" data-category="Assignments" onclick="window.App.filterResources('Assignments', this)">Assignments</div>
                    <div class="tab" data-category="Lab Records" onclick="window.App.filterResources('Lab Records', this)">Lab Records</div>
                    <div class="tab" data-category="Presentations" onclick="window.App.filterResources('Presentations', this)">Presentations</div>
                    <div class="tab" data-category="Document" onclick="window.App.filterResources('Document', this)">Document</div>
                    <div class="tab" data-category="Other" onclick="window.App.filterResources('Other', this)">Other</div>
                </div>

                <div class="flex gap-4" style="flex-wrap: wrap;" id="resources-grid">
                    ${resHTML}
                </div>
            </div>
            <script>
                setTimeout(() => {
                    const searchInput = document.getElementById('resource-search');
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => window.App.searchResources(e.target.value));
                    }
                }, 100);
            </script>
        `;
    },

    renderAssignments(assignments, isHost) {
        let assHTML = assignments.map(a => `
            <div class="card mb-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="text-sm font-medium text-muted mb-1">${a.subject}</p>
                        <h3>${a.title}</h3>
                    </div>
                    ${isHost ? `<button class="btn btn-ghost btn-sm text-danger" onclick="window.App.Modals.showDeleteAssignmentModal('${a.id}', '${a.title}')"><i class="ph ph-trash"></i></button>` : ''}
                </div>
                <div class="flex items-center gap-4 text-sm text-muted mb-4">
                    <span><i class="ph ph-calendar-blank"></i> Due: ${new Date(a.due_date).toLocaleDateString()}</span>
                </div>
                <p class="text-sm">${a.description || 'No description provided.'}</p>
            </div>
        `).join('');

        if (assignments.length === 0) {
            assHTML = `
                <div class="empty-state w-full">
                    <div class="empty-state-icon">📝</div>
                    <h3>No assignments</h3>
                    <p>There are no upcoming assignments.</p>
                </div>
            `;
        }

        return `
            <div class="view-container">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="mb-1">Assignments</h1>
                    ${isHost ? `
                    <button class="btn btn-primary" onclick="window.App.Modals.showAssignmentModal()">
                        <i class="ph ph-plus"></i> Create Assignment
                    </button>
                    ` : ''}
                </div>
                <div style="max-width: 800px;">
                    ${assHTML}
                </div>
            </div>
        `;
    },

    renderAnnouncements(announcements, isHost) {
        let annHTML = announcements.map(a => `
            <div class="card mb-4 relative" style="border-left: 4px solid var(--accent-primary);">
                <div class="flex justify-between items-start">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="avatar-sm" style="width: 32px; height: 32px;">${(a.profiles?.name || 'H').substring(0,2).toUpperCase()}</div>
                        <div>
                            <h3 class="m-0 text-base">${a.title}</h3>
                            <div class="text-xs text-muted">Posted by ${a.profiles?.name || 'Someone'} • ${new Date(a.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    ${isHost ? `<button class="btn btn-ghost btn-sm text-danger" onclick="window.App.Modals.showDeleteAnnouncementModal('${a.id}', '${a.title}')"><i class="ph ph-trash"></i></button>` : ''}
                </div>
                <p style="padding-left: 2.75rem;">${a.content}</p>
            </div>
        `).join('');

        if (announcements.length === 0) {
            annHTML = `
                <div class="empty-state w-full">
                    <div class="empty-state-icon">📢</div>
                    <h3>No announcements</h3>
                    <p>There are no announcements for this class.</p>
                </div>
            `;
        }

        return `
            <div class="view-container">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="mb-1">Announcements</h1>
                    ${isHost ? `
                    <button class="btn btn-primary" onclick="window.App.Modals.showAnnouncementModal()">
                        <i class="ph ph-plus"></i> New Announcement
                    </button>
                    ` : ''}
                </div>
                <div style="max-width: 800px;">
                    ${annHTML}
                </div>
            </div>
        `;
    },
    
    renderClassmates(members, classroomName) {
        const students = members.filter(m => m.profiles.role === 'student');
        
        let stuHTML = students.map(s => `
            <div class="flex items-center p-4 border-b" style="border-bottom: 1px solid var(--border-color);">
                <div class="flex items-center gap-4">
                    <div class="avatar">${s.profiles.name.substring(0,2).toUpperCase()}</div>
                    <div>
                        <h4 class="m-0">${s.profiles.name}</h4>
                        <span class="text-xs text-muted">${s.profiles.student_id || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="view-container">
                <div class="mb-6">
                    <h1 class="mb-1">${classroomName} Members</h1>
                    <p class="text-muted">${students.length} Students</p>
                </div>

                <div class="search-input-wrapper mb-6" style="max-width: 600px;">
                    <i class="ph ph-magnifying-glass"></i>
                    <input type="text" id="classmate-search" class="form-input search-input" placeholder="Search classmates...">
                </div>

                <div class="card p-0" style="overflow: hidden; max-width: 800px;">
                    ${stuHTML}
                </div>
            </div>
        `;
    }
};
