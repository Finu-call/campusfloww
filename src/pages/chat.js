import { chatService } from '../services/chatService.js';

export const ChatView = {
    async render(classroomId, currentUser) {
        const result = await chatService.getMessages(classroomId);

        if (!result.success) {
            return `
                <div class="view-container">
                    <div class="card chat-error">
                        <i class="ph ph-warning-circle"></i>
                        <h2>Unable to load chat</h2>
                        <p>${this.escapeHTML(result.message)}</p>
                    </div>
                </div>
            `;
        }

        const messages = result.messages;

        return `
            <div class="chat-page">
                <div class="chat-header">
                    <div class="chat-header-copy">
                        <h1>Class Chat</h1>
                        <p>Chat with everyone in this classroom</p>
                    </div>
                    <div class="chat-header-icon">
                        <i class="ph-fill ph-chats-circle"></i>
                    </div>
                </div>

                <div id="chat-messages" class="chat-messages">
                    ${this.renderMessages(messages, currentUser.id)}
                </div>

                <form id="chat-form" class="chat-input-area" onsubmit="window.App.sendChatMessage(event)">
                    <input
                        id="chat-input"
                        class="form-input"
                        type="text"
                        placeholder="Type a message..."
                        autocomplete="off"
                        maxlength="1000"
                        aria-label="Message"
                    >
                    <button type="submit" class="btn btn-primary chat-send-btn" aria-label="Send message">
                        <i class="ph ph-paper-plane-right"></i>
                    </button>
                </form>
            </div>
        `;
    },

    renderMessages(messages, currentUserId) {
        if (!messages.length) {
            return `
                <div class="chat-empty">
                    <div class="chat-empty-icon">
                        <i class="ph ph-chats-circle"></i>
                    </div>
                    <h3>No messages yet</h3>
                    <p>Start the conversation with your classmates.</p>
                </div>
            `;
        }

        return messages.map(message => this.renderMessage(message, currentUserId)).join('');
    },

    renderMessage(message, currentUserId) {
        const mine = message.sender_id === currentUserId;
        const senderName = message.profiles?.name || 'User';
        const initials = senderName.substring(0, 2).toUpperCase();
        const time = new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="chat-message ${mine ? 'mine' : 'other'}" data-message-id="${message.id}">
                ${!mine ? `
                    <div class="chat-avatar">${this.escapeHTML(initials)}</div>
                ` : ''}

                <div class="chat-bubble-wrapper">
                    ${!mine ? `
                        <div class="chat-sender">${this.escapeHTML(senderName)}</div>
                    ` : ''}

                    <div class="chat-bubble">
                        ${this.escapeHTML(message.message)}
                    </div>

                    <div class="chat-meta">
                        <span>${time}</span>
                        ${mine ? `
                            <button
                                type="button"
                                class="chat-delete-btn"
                                onclick="window.App.deleteChatMessage('${message.id}')"
                                aria-label="Delete message"
                                title="Delete message"
                            >
                                <i class="ph ph-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    escapeHTML(value) {
        const div = document.createElement('div');
        div.textContent = value ?? '';
        return div.innerHTML;
    }
};
