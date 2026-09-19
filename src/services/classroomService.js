import { supabase } from './supabaseClient.js';

export const classroomService = {
    // --- Classrooms ---
    async getClassroomsForUser(userId, role) {
        if (role === 'host') {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('host_id', userId)
                .order('created_at', { ascending: false });
            if (error) console.error(error);
            return data || [];
        } else {
            // Student: Get classrooms they are a member of
            const { data, error } = await supabase
                .from('classroom_members')
                .select('classrooms(*)')
                .eq('user_id', userId)
                .eq('status', 'active');
            if (error) console.error(error);
            return data ? data.map(d => d.classrooms) : [];
        }
    },

    async createClassroom(hostId, data) {
        const { data: newClass, error } = await supabase
            .from('classrooms')
            .insert([{
                name: data.name,
                description: data.description,
                department: data.department,
                institution: data.institution,
                semester: data.semester,
                academic_year: data.academicYear,
                host_id: hostId
            }])
            .select()
            .single();
            
        if (error) return { success: false, message: error.message };
        return { success: true, classroom: newClass };
    },

    async updateClassroom(id, data) {
        const { error } = await supabase
            .from('classrooms')
            .update({
                name: data.name,
                description: data.description,
                department: data.department,
                institution: data.institution,
                semester: data.semester,
                academic_year: data.academicYear
            })
            .eq('id', id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    },

    async deleteClassroom(id) {
        const { error } = await supabase
            .from('classrooms')
            .delete()
            .eq('id', id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    },

    // --- Members ---
    async getMembers(classroomId) {
        const { data, error } = await supabase
            .from('classroom_members')
            .select('*, profiles(*)')
            .eq('classroom_id', classroomId)
            .eq('status', 'active');
        if (error) console.error(error);
        return data || [];
    },

    // --- Announcements ---
    async getAnnouncements(classroomId) {
        const { data, error } = await supabase
            .from('announcements')
            .select('*, profiles(name, avatar_url)')
            .eq('classroom_id', classroomId)
            .order('created_at', { ascending: false });
        if (error) console.error(error);
        return data || [];
    },
    
    async createAnnouncement(classroomId, postedBy, data) {
        const { error } = await supabase
            .from('announcements')
            .insert([{
                classroom_id: classroomId,
                posted_by: postedBy,
                title: data.title,
                content: data.content,
                priority: data.priority
            }]);
            
        if (error) return { success: false, message: error.message };
        await this.logActivity(classroomId, postedBy, `Posted an announcement: ${data.title}`);
        return { success: true };
    },

    async deleteAnnouncement(id) {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    },

    // --- Activity ---
    async getActivity(classroomId) {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('*, profiles(name)')
            .eq('classroom_id', classroomId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error) console.error(error);
        return data || [];
    },
    
    async logActivity(classroomId, userId, action) {
        const { error } = await supabase
            .from('activity_logs')
            .insert([{
                classroom_id: classroomId,
                user_id: userId,
                action: action
            }]);
        if (error) console.error(error);
    },

    async clearActivity(classroomId) {
        const { error } = await supabase
            .from('activity_logs')
            .delete()
            .eq('classroom_id', classroomId);
        if (error) return { success: false, message: error.message };
        return { success: true };
    }
};
