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
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Chat load error:', error);
            return { success: false, message: error.message, messages: [] };
        }

        return { success: true, messages: data || [] };
    },

    async sendMessage(classroomId, senderId, message) {
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
                sender_id: senderId,
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
