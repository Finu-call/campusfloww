import { authService } from './services/authService.js';
import { classroomService } from './services/classroomService.js';
import { resourceService } from './services/resourceService.js';
import { assignmentService } from './services/assignmentService.js';
import { UI } from './utils/ui.js';
import { Sidebar } from './components/sidebar.js';
import { Modals } from './components/modals.js';
import { AuthViews } from './pages/login.js';
import { HostDashboard } from './pages/hostDashboard.js';
import { StudentDashboard } from './pages/studentDashboard.js';
import { SharedViews } from './pages/sharedViews.js';
import { supabase } from './services/supabaseClient.js';

class AppController {
    init() {
        UI.initTheme();

        window.App = this;
        window.UI = UI;
        this.Modals = Modals;

        this.activeClassroomId = localStorage.getItem('activeClassroomId') || null;
        this.realtimeSubscriptions = [];

        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    setActiveClassroom(id) {
        this.activeClassroomId = id;
        localStorage.setItem('activeClassroomId', id);
        
        // Re-subscribe to realtime events for the new classroom
        this.setupRealtime(id);
        
        window.location.hash = '#classroom';
    }

    setupRealtime(classroomId) {
        // Clear old subscriptions
        this.realtimeSubscriptions.forEach(sub => supabase.removeChannel(sub));
        this.realtimeSubscriptions = [];

        if (!classroomId) return;

        const channel = supabase.channel(`classroom_${classroomId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'resources', filter: `classroom_id=eq.${classroomId}` }, () => {
                if(window.location.hash === '#resources' || window.location.hash === '#classroom') this.handleRoute();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements', filter: `classroom_id=eq.${classroomId}` }, () => {
                if(window.location.hash === '#announcements' || window.location.hash === '#classroom') this.handleRoute();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments', filter: `classroom_id=eq.${classroomId}` }, () => {
                if(window.location.hash === '#assignments' || window.location.hash === '#classroom') this.handleRoute();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'classroom_members', filter: `classroom_id=eq.${classroomId}` }, () => {
                if(window.location.hash === '#members' || window.location.hash === '#classroom') this.handleRoute();
            })
            .subscribe();

        this.realtimeSubscriptions.push(channel);
    }

    async handleRoute() {
        const user = await authService.getCurrentUser();
        const hash = window.location.hash.substring(1) || '';
        
        const main = document.getElementById('main-content');
        const sidebarEl = document.getElementById('sidebar');
        const bottomNavEl = document.getElementById('bottom-nav');

        // Close mobile sidebar if open
        if (sidebarEl && sidebarEl.classList.contains('open')) {
            sidebarEl.classList.remove('open');
        }

        if (!user) {
            sidebarEl.classList.add('hidden');
            bottomNavEl.classList.add('hidden');
            
            if (hash === 'signup') {
                main.innerHTML = AuthViews.renderSignup();
            } else if (hash === 'forgot-password') {
                main.innerHTML = AuthViews.renderForgotPassword();
            } else if (hash === 'reset-password' || hash.includes('type=recovery')) {
                main.innerHTML = AuthViews.renderResetPassword();
            } else {
                main.innerHTML = AuthViews.renderLogin();
            }
            return;
        }

        // Setup realtime if not setup
        if (this.activeClassroomId && this.realtimeSubscriptions.length === 0) {
            this.setupRealtime(this.activeClassroomId);
        }

        const isHost = user.role === 'host';
        const classrooms = await classroomService.getClassroomsForUser(user.id, user.role);

        // Verify active classroom is valid
        if (this.activeClassroomId && !classrooms.find(c => c.id === this.activeClassroomId)) {
            this.activeClassroomId = null;
            localStorage.removeItem('activeClassroomId');
        }

        // Render Sidebar
        sidebarEl.classList.remove('hidden');
        bottomNavEl.classList.remove('hidden');
        Sidebar.render(user, this.activeClassroomId !== null);
        this.updateSidebarActive(hash);

        // Auto routing
        if (hash === '' || hash === 'login') {
            window.location.hash = '#dashboard';
            return;
        }
        
        main.innerHTML = `
            <div class="flex items-center justify-center" style="height: 100%; min-height: 400px;">
                <i class="ph ph-spinner ph-spin" style="font-size: 3rem; color: var(--accent-primary);"></i>
            </div>
        `;

        let viewHTML = '';

        if (hash === 'dashboard' || hash === 'classrooms') {
            if (isHost) {
                viewHTML = HostDashboard.renderClassrooms(classrooms);
            } else {
                viewHTML = StudentDashboard.renderClassrooms(classrooms);
            }
        } else if (hash === 'profile') {
            viewHTML = StudentDashboard.renderProfile(user);
        } else {
            // Classroom specific routes require an active classroom
            if (!this.activeClassroomId) {
                window.location.hash = '#dashboard';
                return;
            }

            const activeClassroom = classrooms.find(c => c.id === this.activeClassroomId);
            
            switch(hash) {
                case 'classroom': {
                    if (isHost) {
                        const members = await classroomService.getMembers(this.activeClassroomId);
                        const [resources, assignments, announcements, activity] = await Promise.all([
                            resourceService.getResources(this.activeClassroomId), 
                            assignmentService.getAssignments(this.activeClassroomId), 
                            classroomService.getAnnouncements(this.activeClassroomId), 
                            classroomService.getActivity(this.activeClassroomId)
                        ]);
                        viewHTML = HostDashboard.renderOverview(user, activeClassroom, members.length, resources.length, assignments.length, announcements.length, activity); 
                    } else {
                        const members = await classroomService.getMembers(this.activeClassroomId);
                        const [resources, assignments, announcements] = await Promise.all([
                            resourceService.getResources(this.activeClassroomId), 
                            assignmentService.getAssignments(this.activeClassroomId), 
                            classroomService.getAnnouncements(this.activeClassroomId)
                        ]);
                        viewHTML = StudentDashboard.renderOverview(user, activeClassroom, resources, assignments, announcements, members.length); 
                    }
                    break;
                }
                case 'members': {
                    const members = await classroomService.getMembers(this.activeClassroomId);
                    if (isHost) {
                        viewHTML = HostDashboard.renderStudents(members);
                    } else {
                        viewHTML = SharedViews.renderClassmates(members, activeClassroom.name);
                    }
                    break;
                }
                case 'settings': {
                    if (isHost) {
                        viewHTML = HostDashboard.renderSettings(activeClassroom);
                    } else {
                        window.location.hash = '#classroom';
                        return;
                    }
                    break;
                }
                case 'resources': {
                    const resources = await resourceService.getResources(this.activeClassroomId);
                    viewHTML = SharedViews.renderResources(resources, isHost, user.id); 
                    break;
                }
                case 'assignments': {
                    const assignments = await assignmentService.getAssignments(this.activeClassroomId);
                    viewHTML = SharedViews.renderAssignments(assignments, isHost); 
                    break;
                }
                case 'announcements': {
                    const announcements = await classroomService.getAnnouncements(this.activeClassroomId);
                    viewHTML = SharedViews.renderAnnouncements(announcements, isHost); 
                    break;
                }
                default: {
                    window.location.hash = '#classroom';
                    return;
                }
            }
        }

        main.innerHTML = viewHTML;
    }

    updateSidebarActive(route) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === route) {
                item.classList.add('active');
            }
        });
    }

    // --- Auth Action Handlers ---

    async handleLogin(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> LOGGING IN...';
        btn.disabled = true;
        
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        
        const result = await authService.login(email, pass);
        if (result.success) {
            window.location.hash = '#dashboard';
            UI.showToast('Login successful!');
        } else {
            btn.innerHTML = 'Login';
            btn.disabled = false;
            UI.showToast(result.message, 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> CREATING ACCOUNT...';
        btn.disabled = true;
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (password !== confirm) {
            btn.innerHTML = 'Create Host Account';
            btn.disabled = false;
            UI.showToast('Passwords do not match', 'error');
            return;
        }

        const result = await authService.signupHost(name, email, password);
        if (result.success) {
            const loginResult = await authService.login(email, password);
            if (loginResult.success) {
                window.location.hash = '#dashboard';
                UI.showToast('Account created successfully!');
            } else {
                window.location.hash = '#login';
                UI.showToast('Account created! Please log in.', 'info');
            }
        } else {
            btn.innerHTML = 'Create Host Account';
            btn.disabled = false;
            UI.showToast(result.message, 'error');
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Sending...';
        btn.disabled = true;

        const result = await authService.resetPasswordForEmail(email);
        if (result.success) {
            UI.showToast('Password reset email sent! Check your inbox.', 'success');
            setTimeout(() => { window.location.hash = '#login'; }, 2000);
        } else {
            btn.innerHTML = 'Send Reset Link';
            btn.disabled = false;
            UI.showToast(result.message, 'error');
        }
    }

    async handleResetPasswordSubmit(e) {
        e.preventDefault();
        const p1 = document.getElementById('reset-pass').value;
        const p2 = document.getElementById('reset-confirm').value;
        if (p1 !== p2) {
            UI.showToast('Passwords do not match', 'error');
            return;
        }
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Updating...';
        btn.disabled = true;

        const result = await authService.updatePassword(p1);
        if (result.success) {
            UI.showToast('Password updated successfully! You can now log in.', 'success');
            setTimeout(() => { window.location.hash = '#login'; }, 2000);
        } else {
            btn.innerHTML = 'Update Password';
            btn.disabled = false;
            UI.showToast(result.message, 'error');
        }
    }

    logout() {
        authService.logout();
        this.activeClassroomId = null;
        localStorage.removeItem('activeClassroomId');
        this.realtimeSubscriptions.forEach(sub => supabase.removeChannel(sub));
        this.realtimeSubscriptions = [];
        window.location.hash = '';
        UI.showToast('Logged out successfully');
    }

    // --- Classroom Actions ---
    async handleCreateClassroom(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Creating...';
        btn.disabled = true;

        try {
            const user = await authService.getCurrentUser();
            
            // Safe getter in case the user hasn't refreshed their browser and elements are missing
            const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

            const data = {
                name: getValue('cc-name'),
                description: getValue('cc-desc'),
                department: getValue('cc-dept'),
                institution: getValue('cc-inst'),
                semester: getValue('cc-sem'),
                academicYear: getValue('cc-year')
            };

            const result = await classroomService.createClassroom(user.id, data);
            
            if (result.success) {
                UI.closeModal('create-classroom-modal');
                UI.showToast('Classroom created successfully');
                this.setActiveClassroom(result.classroom.id);
            } else {
                UI.showToast('DB Error: ' + result.message, 'error');
                btn.innerHTML = 'Create Classroom';
                btn.disabled = false;
            }
        } catch (err) {
            UI.showToast('App Error: ' + err.message, 'error');
            console.error(err);
            btn.innerHTML = 'Create Classroom';
            btn.disabled = false;
        }
    }

    async handleUpdateClassroom(e, id) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
        btn.disabled = true;

        const data = {
            name: document.getElementById('cs-name').value,
            description: document.getElementById('cs-desc').value,
            department: document.getElementById('cs-dept').value,
            institution: document.getElementById('cs-inst').value,
            semester: document.getElementById('cs-sem').value,
            academicYear: document.getElementById('cs-year').value
        };

        const result = await classroomService.updateClassroom(id, data);
        if (result.success) {
            UI.showToast('Settings saved successfully');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
        }
        btn.innerHTML = 'Save Changes';
        btn.disabled = false;
    }

    async handleDeleteClassroom(id) {
        const result = await classroomService.deleteClassroom(id);
        if (result.success) {
            UI.closeModal('delete-class-modal');
            this.activeClassroomId = null;
            localStorage.removeItem('activeClassroomId');
            window.location.hash = '#dashboard';
            UI.showToast('Classroom deleted');
        } else {
            UI.showToast(result.message, 'error');
        }
    }

    async handleClearActivity(id) {
        const result = await classroomService.clearActivity(id);
        if (result.success) {
            UI.closeModal('clear-act-modal');
            UI.showToast('Activity history cleared');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
        }
    }

    // --- Member Actions ---
    async handleAddStudent(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Adding...';
        btn.disabled = true;
        
        const result = await authService.createStudent(
            document.getElementById('as-name').value,
            document.getElementById('as-email').value,
            document.getElementById('as-pass').value,
            document.getElementById('as-id').value,
            this.activeClassroomId
        );

        if (result.success) {
            UI.closeModal('add-student-modal');
            UI.showToast('Student added successfully');
            this.handleRoute(); 
        } else {
            UI.showToast(result.message, 'error');
            btn.innerHTML = 'Create Student Account';
            btn.disabled = false;
        }
    }

    async handleRemoveStudent(userId) {
        // Technically just marking inactive or deleting from classroom_members
        const { error } = await supabase.from('classroom_members').delete().match({ classroom_id: this.activeClassroomId, user_id: userId });
        if (error) {
            UI.showToast(error.message, 'error');
        } else {
            UI.closeModal('remove-modal');
            UI.showToast('Student removed from classroom');
            this.handleRoute();
        }
    }

    async handleLeaveClassroom(classroomId) {
        const user = await authService.getCurrentUser();
        const { error } = await supabase.from('classroom_members').delete().match({ classroom_id: classroomId, user_id: user.id });
        if (error) {
            UI.showToast(error.message, 'error');
        } else {
            UI.closeModal('leave-modal');
            this.activeClassroomId = null;
            localStorage.removeItem('activeClassroomId');
            window.location.hash = '#dashboard';
            UI.showToast('You have left the classroom');
        }
    }

    // --- Content Actions ---
    async handleUpload(e) {
        e.preventDefault();
        const fileInput = document.getElementById('file-input');
        if(!fileInput.files || !fileInput.files[0]) {
            UI.showToast('Please select a file first', 'error');
            return;
        }
        
        const btn = document.getElementById('upload-btn');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Uploading...';
        btn.disabled = true;

        const file = fileInput.files[0];
        const ext = file.name.split('.').pop().toLowerCase();
        let type = 'Other';
        if(['pdf'].includes(ext)) type = 'PDF';
        if(['doc','docx','txt'].includes(ext)) type = 'Document';
        if(['jpg','jpeg','png','gif','svg'].includes(ext)) type = 'Image';
        if(['ppt','pptx'].includes(ext)) type = 'Presentation';

        const user = await authService.getCurrentUser();

        const result = await resourceService.addResource(
            this.activeClassroomId, 
            user.id, 
            file, 
            {
                title: document.getElementById('up-title').value,
                subject: document.getElementById('up-subject').value,
                category: document.getElementById('up-category').value,
                description: document.getElementById('up-desc').value,
                type: type,
                size: (file.size / (1024*1024)).toFixed(1) + ' MB'
            }
        );

        if (result.success) {
            UI.closeModal('upload-modal');
            UI.showToast('Resource uploaded successfully');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
            btn.innerHTML = 'Upload Resource';
            btn.disabled = false;
        }
    }

    async handleDeleteResource(id, filePath) {
        const result = await resourceService.deleteResource(id, filePath);
        if (result.success) {
            UI.closeModal('delete-res-modal');
            UI.showToast('Resource deleted');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
        }
    }

    async handleAnnouncement(e) {
        e.preventDefault();
        const user = await authService.getCurrentUser();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Publishing...';
        btn.disabled = true;
        
        const result = await classroomService.createAnnouncement(this.activeClassroomId, user.id, {
            title: document.getElementById('ann-title').value,
            content: document.getElementById('ann-content').value,
            priority: document.getElementById('ann-priority').value
        });
        
        if (result.success) {
            UI.closeModal('ann-modal');
            UI.showToast('Announcement posted');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
            btn.innerHTML = 'Publish Announcement';
            btn.disabled = false;
        }
    }

    async handleDeleteAnnouncement(id) {
        const result = await classroomService.deleteAnnouncement(id);
        if (result.success) {
            UI.closeModal('delete-ann-modal');
            UI.showToast('Announcement deleted');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
        }
    }

    async handleAssignment(e) {
        e.preventDefault();
        const user = await authService.getCurrentUser();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Creating...';
        btn.disabled = true;
        
        const result = await assignmentService.createAssignment(this.activeClassroomId, user.id, {
            title: document.getElementById('ass-title').value,
            subject: document.getElementById('ass-subject').value,
            dueDate: document.getElementById('ass-due').value,
            description: document.getElementById('ass-desc').value
        });
        
        if (result.success) {
            UI.closeModal('ass-modal');
            UI.showToast('Assignment created');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
            btn.innerHTML = 'Create Assignment';
            btn.disabled = false;
        }
    }

    async handleDeleteAssignment(id) {
        const result = await assignmentService.deleteAssignment(id);
        if (result.success) {
            UI.closeModal('delete-ass-modal');
            UI.showToast('Assignment deleted');
            this.handleRoute();
        } else {
            UI.showToast(result.message, 'error');
        }
    }

    async handleDeleteAccount() {
        const result = await authService.deleteAccount();
        if (result.success) {
            UI.closeModal('delete-acc-modal');
            this.logout();
        } else {
            UI.showToast(result.message, 'error');
        }
    }

    // --- Search & Filter ---
    filterResources(category, tabElement) {
        // Update active tab styling
        if (tabElement) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tabElement.classList.add('active');
        }

        const cards = document.querySelectorAll('.resource-card');
        cards.forEach(card => {
            const cardCategory = card.querySelector('.badge').textContent;
            if (category === 'All' || cardCategory.includes(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchResources(query) {
        query = query.toLowerCase();
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const subject = card.querySelector('.text-muted').textContent.toLowerCase();
            
            if (title.includes(query) || subject.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Initialize App
    window.App = new AppController();
    window.App.init();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
});
