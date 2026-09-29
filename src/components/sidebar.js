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
            bottomNavItems += `
                <a href="#classroom" class="nav-item" data-route="classroom">
                    <i class="ph ph-chalkboard"></i><span>Class</span>
                </a>
                <a href="#chat" class="nav-item" data-route="chat">
                    <i class="ph ph-chats"></i><span>Chat</span>
                </a>
            `;
        } else {
            bottomNavItems += `
                <a href="#dashboard" class="nav-item" data-route="dashboard">
                    <i class="ph ph-books"></i><span>Classrooms</span>
                </a>
                <a href="#dashboard" class="nav-item" data-route="dashboard">
                    <i class="ph ph-chats"></i><span>Chat</span>
                </a>
            `;
        }

        bottomNavItems += `
            <a href="#profile" class="nav-item" data-route="profile">
                <i class="ph ph-user-circle"></i><span>Profile</span>
            </a>
            <button type="button" class="nav-item mobile-logout-btn" onclick="window.App.logout()">
                <i class="ph ph-sign-out"></i><span>Logout</span>
            </button>
        `;

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
