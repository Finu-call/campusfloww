import { notificationService } from '../services/notificationService.js';

export const NotificationView = {
    async render(user) {
        const result = await notificationService.getNotifications(user.id);

        if (!result.success) {
            return `
                <div class="view-container">
                    <div class="card">
                        <h2>Notifications</h2>
                        <p class="text-muted">${this.escape(result.message)}</p>
                    </div>
                </div>`;
        }

        const notifications = result.notifications;

        return `
            <div class="view-container notifications-page">
                <div class="notifications-title-row">
                    <div>
                        <h1>Notifications</h1>
                        <p class="text-muted">Stay updated with your campus activity.</p>
                    </div>
                    ${notifications.some(n => !n.is_read) ? `
                        <button class="btn btn-outline" onclick="window.App.markAllNotificationsRead()">
                            Mark all read
                        </button>
                    ` : ''}
                </div>

                <div class="card push-notification-card">
                    <div>
                        <strong>Background notifications</strong>
                        <p class="text-muted">Get announcements, assignments and resources even when CampusFlow is not open.</p>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn btn-primary" onclick="window.App.enablePushNotifications()">
                            <i class="ph ph-bell-ringing"></i> Enable Notifications
                        </button>
                        <button class="btn btn-outline" onclick="window.App.testPushNotification()">
                            <i class="ph ph-paper-plane-tilt"></i> Test
                        </button>
                    </div>
                </div>

                <div class="notifications-list">
                    ${notifications.length
                        ? notifications.map(n => this.renderNotification(n)).join('')
                        : `
                            <div class="card notifications-empty">
                                <i class="ph ph-bell-slash"></i>
                                <h3>You're all caught up</h3>
                                <p class="text-muted">New announcements, assignments and updates will appear here.</p>
                            </div>`}
                </div>
            </div>`;
    },

    renderNotification(n) {
        const icons = {
            announcement: 'ph-megaphone',
            assignment: 'ph-file-text',
            resource: 'ph-books',
            chat: 'ph-chats',
            classroom: 'ph-chalkboard'
        };
        const route = n.route || (n.classroom_id ? '#classroom' : '#notifications');

        return `
            <button type="button"
                class="notification-item ${n.is_read ? '' : 'unread'}"
                onclick="window.App.openNotification('${n.id}', '${this.escapeAttr(route)}')">
                <span class="notification-icon"><i class="ph ${icons[n.type] || 'ph-bell'}"></i></span>
                <span class="notification-copy">
                    <strong>${this.escape(n.title)}</strong>
                    <span>${this.escape(n.message || '')}</span>
                    <small>${this.timeAgo(n.created_at)}</small>
                </span>
                ${!n.is_read ? '<span class="notification-dot"></span>' : ''}
            </button>`;
    },

    timeAgo(date) {
        const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return days < 7 ? `${days}d ago` : new Date(date).toLocaleDateString();
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
