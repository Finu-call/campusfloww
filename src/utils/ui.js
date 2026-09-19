export const UI = {
    initTheme() {
        const savedTheme = localStorage.getItem('campusflow_theme') || 'light';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('campusflow_theme', theme);
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ph-check-circle';
        if (type === 'error') icon = 'ph-warning-circle';
        if (type === 'info') icon = 'ph-info';

        toast.innerHTML = `
            <i class="ph-fill ${icon}" style="font-size: 1.25rem; color: var(--${type === 'error' ? 'danger' : 'success'})"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    openModal(modalId, contentHTML) {
        const container = document.getElementById('modal-container');
        if (!container) return;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = modalId;

        overlay.innerHTML = `
            <div class="modal-content" onclick="event.stopPropagation()">
                ${contentHTML}
            </div>
        `;

        overlay.addEventListener('click', () => this.closeModal(modalId));
        container.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            const content = modal.querySelector('.modal-content');
            if (content) content.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                modal.remove();
                if (document.getElementById('modal-container').children.length === 0) {
                    document.body.style.overflow = '';
                }
            }, 150);
        }
    },
    
    closeAllModals() {
        const container = document.getElementById('modal-container');
        if(container) {
            container.innerHTML = '';
            document.body.style.overflow = '';
        }
    },

    getFileIcon(type) {
        const types = {
            'PDF': '📄',
            'Document': '📝',
            'Image': '🖼️',
            'Presentation': '📊',
            'Notes': '📚',
            'Other': '📦'
        };
        return types[type] || '📄';
    }
};
