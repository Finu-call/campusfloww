import { supabase } from './supabaseClient.js';

export const notificationService = {
    async getNotifications(userId, limit = 30) {
        const { data, error } = await supabase
            .from('campus_notifications')
            .select('id, user_id, classroom_id, type, title, message, route, is_read, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Notification load error:', error);
            return { success: false, message: error.message, notifications: [] };
        }

        return { success: true, notifications: data || [] };
    },

    async getUnreadCount(userId) {
        const { count, error } = await supabase
            .from('campus_notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) return { success: false, count: 0 };
        return { success: true, count: count || 0 };
    },

    async markRead(notificationId) {
        const { error } = await supabase
            .from('campus_notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        return error
            ? { success: false, message: error.message }
            : { success: true };
    },

    async markAllRead(userId) {
        const { error } = await supabase
            .from('campus_notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        return error
            ? { success: false, message: error.message }
            : { success: true };
    }
};
