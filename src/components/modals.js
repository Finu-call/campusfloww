import { UI } from '../utils/ui.js';

export const Modals = {
    // --- Classroom & Member Management ---
    showCreateClassroomModal() {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl">Create Classroom</h2>
                <button class="modal-close" onclick="window.UI.closeModal('create-classroom-modal')"><i class="ph ph-x"></i></button>
            </div>
            <form onsubmit="window.App.handleCreateClassroom(event)">
                <div class="form-group mb-4">
                    <label class="form-label">Classroom Name</label>
                    <input type="text" id="cc-name" class="form-input" required>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Description</label>
                    <textarea id="cc-desc" class="form-input"></textarea>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Department</label>
                    <input type="text" id="cc-dept" class="form-input">
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Institution</label>
                    <input type="text" id="cc-inst" class="form-input">
                </div>
                <div class="flex gap-4 mb-6">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Semester</label>
                        <input type="text" id="cc-sem" class="form-input">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Academic Year</label>
                        <input type="text" id="cc-year" class="form-input">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary w-full py-3">Create Classroom</button>
            </form>
        `;
        UI.openModal('create-classroom-modal', modalHtml);
    },

    showAddStudentModal() {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl">Add Student</h2>
                <button class="modal-close" onclick="window.UI.closeModal('add-student-modal')"><i class="ph ph-x"></i></button>
            </div>
            <form onsubmit="window.App.handleAddStudent(event)">
                <div class="form-group mb-4">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="as-name" class="form-input" required>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Email</label>
                    <input type="email" id="as-email" class="form-input" required>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Temporary Password</label>
                    <input type="password" id="as-pass" class="form-input" minlength="8" required>
                </div>
                <div class="form-group mb-6">
                    <label class="form-label">Student ID</label>
                    <input type="text" id="as-id" class="form-input">
                </div>
                <button type="submit" class="btn btn-primary w-full py-3">Create Student Account</button>
            </form>
        `;
        UI.openModal('add-student-modal', modalHtml);
    },

    showRemoveStudentModal(id, name) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Remove Student?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('remove-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="text-center mb-6">
                <p>Are you sure you want to remove <strong>${name}</strong> from this classroom?</p>
                <p class="text-sm text-muted mt-2">Their account will not be deleted, but they will lose access to this classroom's resources.</p>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('remove-modal')">Cancel</button>
                <button class="btn btn-primary flex-1" style="background: var(--danger);" onclick="window.App.handleRemoveStudent('${id}')">Remove</button>
            </div>
        `;
        UI.openModal('remove-modal', modalHtml);
    },

    showLeaveClassroomModal(id, name) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Leave Classroom?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('leave-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="mb-6">
                <p>You will lose access to:</p>
                <ul class="text-sm text-muted mt-2" style="list-style-position: inside;">
                    <li>Classroom resources</li>
                    <li>Announcements</li>
                    <li>Assignments</li>
                    <li>Members</li>
                </ul>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('leave-modal')">Cancel</button>
                <button class="btn btn-primary flex-1" style="background: var(--danger);" onclick="window.App.handleLeaveClassroom('${id}')">Leave Classroom</button>
            </div>
        `;
        UI.openModal('leave-modal', modalHtml);
    },

    // --- Content Creation Modals ---
    showUploadModal() {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl">Upload Resource</h2>
                <button class="modal-close" onclick="window.UI.closeModal('upload-modal')"><i class="ph ph-x"></i></button>
            </div>
            <form onsubmit="window.App.handleUpload(event)">
                <div class="upload-area mb-4">
                    <i class="ph ph-upload-simple" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
                    <p class="mb-2">Drag and drop file here, or click to browse</p>
                    <input type="file" id="file-input" class="hidden" required>
                    <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('file-input').click()">Select File</button>
                    <p id="file-name-display" class="text-sm text-muted mt-2"></p>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Title</label>
                    <input type="text" id="up-title" class="form-input" required>
                </div>
                <div class="flex gap-4 mb-4">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Subject</label>
                        <input type="text" id="up-subject" class="form-input" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Category</label>
                        <select id="up-category" class="form-select">
                            <option>Notes</option>
                            <option>PDFs</option>
                            <option>Images</option>
                            <option>Assignments</option>
                            <option>Lab Records</option>
                            <option>Presentations</option>
                            <option>Document</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group mb-6">
                    <label class="form-label">Description (Optional)</label>
                    <textarea id="up-desc" class="form-input"></textarea>
                </div>
                <button type="submit" id="upload-btn" class="btn btn-primary w-full py-3">Upload Resource</button>
            </form>
        `;
        UI.openModal('upload-modal', modalHtml);

        setTimeout(() => {
            document.getElementById('file-input')?.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    document.getElementById('file-name-display').innerText = e.target.files[0].name;
                }
            });
        }, 100);
    },

    showAnnouncementModal() {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl">New Announcement</h2>
                <button class="modal-close" onclick="window.UI.closeModal('ann-modal')"><i class="ph ph-x"></i></button>
            </div>
            <form onsubmit="window.App.handleAnnouncement(event)">
                <div class="form-group mb-4">
                    <label class="form-label">Title</label>
                    <input type="text" id="ann-title" class="form-input" required>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Message</label>
                    <textarea id="ann-content" class="form-input" rows="4" required></textarea>
                </div>
                <div class="form-group mb-6">
                    <label class="form-label">Priority</label>
                    <select id="ann-priority" class="form-select">
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-full py-3">Publish Announcement</button>
            </form>
        `;
        UI.openModal('ann-modal', modalHtml);
    },

    showAssignmentModal() {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl">Create Assignment</h2>
                <button class="modal-close" onclick="window.UI.closeModal('ass-modal')"><i class="ph ph-x"></i></button>
            </div>
            <form onsubmit="window.App.handleAssignment(event)">
                <div class="form-group mb-4">
                    <label class="form-label">Title</label>
                    <input type="text" id="ass-title" class="form-input" required>
                </div>
                <div class="flex gap-4 mb-4">
                    <div class="form-group" style="flex: 2;">
                        <label class="form-label">Subject</label>
                        <input type="text" id="ass-subject" class="form-input" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Due Date</label>
                        <input type="date" id="ass-due" class="form-input" required>
                    </div>
                </div>
                <div class="form-group mb-6">
                    <label class="form-label">Description</label>
                    <textarea id="ass-desc" class="form-input" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-full py-3">Create Assignment</button>
            </form>
        `;
        UI.openModal('ass-modal', modalHtml);
    },

    // --- Strict Danger Zone Modals ---
    showDeleteClassroomModal(id, name) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Delete Classroom?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('delete-class-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="mb-6">
                <p>You are about to permanently delete:</p>
                <p class="font-medium mt-1 mb-4" style="font-size: 1.1rem;">${name}</p>
                <p class="text-sm text-muted">This may delete:</p>
                <ul class="text-sm text-muted mt-2 mb-4" style="list-style-position: inside;">
                    <li>Classroom membership</li>
                    <li>Resources</li>
                    <li>Announcements</li>
                    <li>Assignments</li>
                    <li>Activity history</li>
                    <li>Classroom files</li>
                </ul>
                <p class="text-danger font-medium mb-2">This action cannot be undone.</p>
                
                <div class="form-group">
                    <label class="form-label">Type the classroom name to confirm:</label>
                    <input type="text" id="delete-class-confirm" class="form-input" oninput="document.getElementById('btn-del-class').disabled = (this.value !== '${name}')">
                </div>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('delete-class-modal')">Cancel</button>
                <button id="btn-del-class" class="btn btn-primary flex-1" style="background: var(--danger);" disabled onclick="window.App.handleDeleteClassroom('${id}')">Permanently Delete</button>
            </div>
        `;
        UI.openModal('delete-class-modal', modalHtml);
    },

    showDeleteResourceModal(id, title, filePath) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Delete Resource?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('delete-res-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="text-center mb-6">
                <p class="font-medium text-lg mb-2">${title}</p>
                <p class="text-sm text-muted">This will permanently delete the resource and its stored file.</p>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('delete-res-modal')">Cancel</button>
                <button class="btn btn-primary flex-1" style="background: var(--danger);" onclick="window.App.handleDeleteResource('${id}', '${filePath}')">Delete</button>
            </div>
        `;
        UI.openModal('delete-res-modal', modalHtml);
    },

    showDeleteAnnouncementModal(id, title) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Delete Announcement?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('delete-ann-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="text-center mb-6">
                <p class="font-medium text-lg mb-2">${title}</p>
                <p class="text-sm text-muted">This announcement will be permanently removed.</p>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('delete-ann-modal')">Cancel</button>
                <button class="btn btn-primary flex-1" style="background: var(--danger);" onclick="window.App.handleDeleteAnnouncement('${id}')">Delete</button>
            </div>
        `;
        UI.openModal('delete-ann-modal', modalHtml);
    },

    showDeleteAssignmentModal(id, title) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Delete Assignment?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('delete-ass-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="text-center mb-6">
                <p class="font-medium text-lg mb-2">${title}</p>
                <p class="text-sm text-muted">This assignment will be permanently removed.</p>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('delete-ass-modal')">Cancel</button>
                <button class="btn btn-primary flex-1" style="background: var(--danger);" onclick="window.App.handleDeleteAssignment('${id}')">Delete</button>
            </div>
        `;
        UI.openModal('delete-ass-modal', modalHtml);
    },

    showClearActivityModal(classroomId) {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Clear Activity History?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('clear-act-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="text-center mb-6">
                <p class="text-muted">This will permanently remove activity records for this classroom.</p>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('clear-act-modal')">Cancel</button>
                <button class="btn btn-primary flex-1" style="background: var(--danger);" onclick="window.App.handleClearActivity('${classroomId}')">Clear History</button>
            </div>
        `;
        UI.openModal('clear-act-modal', modalHtml);
    },

    showDeleteAccountModal() {
        const modalHtml = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="m-0 text-xl text-danger">Delete Account?</h2>
                <button class="modal-close" onclick="window.UI.closeModal('delete-acc-modal')"><i class="ph ph-x"></i></button>
            </div>
            <div class="mb-6">
                <p class="text-sm text-muted mb-4">This action may permanently remove:</p>
                <ul class="text-sm text-muted mt-2 mb-4" style="list-style-position: inside;">
                    <li>Your profile</li>
                    <li>Your classroom memberships</li>
                    <li>Your uploaded resources</li>
                    <li>Your account access</li>
                </ul>
                <p class="text-danger font-medium mb-4">This action cannot be undone.</p>
                
                <div class="form-group">
                    <label class="form-label">Type DELETE to confirm:</label>
                    <input type="text" id="delete-acc-confirm" class="form-input" oninput="document.getElementById('btn-del-acc').disabled = (this.value !== 'DELETE')">
                </div>
            </div>
            <div class="flex gap-4">
                <button class="btn btn-outline flex-1" onclick="window.UI.closeModal('delete-acc-modal')">Cancel</button>
                <button id="btn-del-acc" class="btn btn-primary flex-1" style="background: var(--danger);" disabled onclick="window.App.handleDeleteAccount()">Permanently Delete Account</button>
            </div>
        `;
        UI.openModal('delete-acc-modal', modalHtml);
    }
};
