export const Sidebar = {
    render(user, isClassroomActive = false) {
        if (!user) return '';
        
        const isHost = user.role === 'host';
        
        let navItems = `
            <a href="#dashboard" class="nav-item" data-route="dashboard">
                <i class="ph ph-house"></i>
                <span>Dashboard</span>
            </a>
        `;
        
        let bottomNavItems = `
            <a href="#dashboard" class="nav-item" data-route="dashboard">
                <i class="ph ph-house"></i><span>Home</span>
            </a>
        `;
        
        if (isClassroomActive) {
            navItems += `
                <div class="nav-divider" style="height: 1px; background: var(--border-color); margin: 1rem 0;"></div>
                <div class="nav-label" style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; padding-left: 1rem; font-weight: 600;">Current Class</div>
                <a href="#classroom" class="nav-item" data-route="classroom">
                    <i class="ph ph-chalkboard"></i><span>Overview</span>
                </a>
                <a href="#resources" class="nav-item" data-route="resources">
                    <i class="ph ph-books"></i><span>Resources</span>
                </a>
                <a href="#assignments" class="nav-item" data-route="assignments">
                    <i class="ph ph-file-text"></i><span>Assignments</span>
                </a>
                <a href="#announcements" class="nav-item" data-route="announcements">
                    <i class="ph ph-megaphone"></i><span>Announcements</span>
                </a>
                <a href="#members" class="nav-item" data-route="members">
                    <i class="ph ph-users"></i><span>Members</span>
                </a>
            `;

            bottomNavItems += `
                <a href="#classroom" class="nav-item" data-route="classroom"><i class="ph ph-chalkboard"></i><span>Class</span></a>
                <a href="#resources" class="nav-item" data-route="resources"><i class="ph ph-books"></i><span>Resources</span></a>
                <a href="#announcements" class="nav-item" data-route="announcements"><i class="ph ph-megaphone"></i><span>Updates</span></a>
            `;
        }
        
        let footerItems = '';
        if (isHost) {
            footerItems = `
                ${isClassroomActive ? `<a href="#settings" class="nav-item" data-route="settings"><i class="ph ph-gear"></i><span>Class Settings</span></a>` : ''}
                <a href="#" class="nav-item text-danger" onclick="window.App.logout()">
                    <i class="ph ph-sign-out"></i><span>Logout</span>
                </a>
            `;
        } else {
            footerItems = `
                <a href="#profile" class="nav-item" data-route="profile">
                    <div class="avatar-sm" style="width: 24px; height: 24px;">${user.name.substring(0,2).toUpperCase()}</div>
                    <span>My Profile</span>
                </a>
                <a href="#" class="nav-item text-danger" onclick="window.App.logout()">
                    <i class="ph ph-sign-out"></i><span>Logout</span>
                </a>
            `;
        }

        bottomNavItems += `
            <a href="#" class="nav-item text-danger" onclick="window.App.logout()"><i class="ph ph-sign-out"></i><span>Exit</span></a>
        `;

        document.getElementById('sidebar').innerHTML = `
            <div class="sidebar-header">
                <i class="ph-fill ph-graduation-cap"></i>
                <h2>CampusFlow</h2>
            </div>
            <nav class="sidebar-nav">
                ${navItems}
            </nav>
            <div class="sidebar-footer">
                ${footerItems}
            </div>
        `;

        document.getElementById('bottom-nav').innerHTML = bottomNavItems;
    }
};
