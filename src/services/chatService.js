import { supabase } from './supabaseClient.js';

export const chatService = {
    async getMessages(classroomId) {
        const { data, error } = await supabase
            .from('classroom_messages')
            .select(`
                id,
                classroom_id,
                sender_id,
                message,
                created_at,
                profiles (
                    id,
                    name,
                    avatar_url,
                    role
                )
            `)
            .eq('classroom_id', classroomId)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Chat load error:', error);
            return { success: false, message: error.message, messages: [] };
        }

        return { success: true, messages: (data || []).reverse() };
    },

    async getMessageById(messageId) {
        const { data, error } = await supabase
            .from('classroom_messages')
            .select(`
                id,
                classroom_id,
                sender_id,
                message,
                created_at,
                profiles (
                    id,
                    name,
                    avatar_url,
                    role
                )
            `)
            .eq('id', messageId)
            .single();

        if (error) {
            console.error('Chat message load error:', error);
            return { success: false, message: error.message };
        }

        return { success: true, message: data };
    },

    async sendMessage(classroomId, senderId, message) {
        // Make sure the Supabase auth session is available before the INSERT.
        // This prevents the first message after login from being rejected by RLS
        // until the page is refreshed.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
            return {
                success: false,
                message: 'Your login session is not ready. Please wait a moment and try again.'
            };
        }

        // Always use the authenticated Supabase user as sender.
        const authenticatedUserId = session.user.id;
        if (senderId && senderId !== authenticatedUserId) {
            return {
                success: false,
                message: 'Your login session changed. Please try again.'
            };
        }

        const cleanMessage = message.trim();

        if (!cleanMessage) {
            return { success: false, message: 'Message cannot be empty.' };
        }

        if (cleanMessage.length > 1000) {
            return { success: false, message: 'Message is too long.' };
        }

        const { data, error } = await supabase
            .from('classroom_messages')
            .insert({
                classroom_id: classroomId,
                sender_id: authenticatedUserId,
                message: cleanMessage
            })
            .select(`
                id,
                classroom_id,
                sender_id,
                message,
                created_at,
                profiles (
                    id,
                    name,
                    avatar_url,
                    role
                )
            `)
            .single();

        if (error) {
            console.error('Chat send error:', error);
            return { success: false, message: error.message };
        }

        return { success: true, message: data };
    },

    async deleteMessage(messageId) {
        const { error } = await supabase
            .from('classroom_messages')
            .delete()
            .eq('id', messageId);

        if (error) {
            console.error('Chat delete error:', error);
            return { success: false, message: error.message };
        }

        return { success: true };
    }
};
