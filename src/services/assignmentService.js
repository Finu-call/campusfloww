import { supabase } from './supabaseClient.js';
import { classroomService } from './classroomService.js';

export const assignmentService = {
    async getAssignments(classroomId) {
        const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('classroom_id', classroomId)
            .order('created_at', { ascending: false });
        if (error) console.error(error);
        return data || [];
    },
    
    async createAssignment(classroomId, userId, data) {
        const { error } = await supabase
            .from('assignments')
            .insert([{
                classroom_id: classroomId,
                title: data.title,
                subject: data.subject,
                due_date: data.dueDate,
                description: data.description
            }]);
            
        if (error) return { success: false, message: error.message };
        await classroomService.logActivity(classroomId, userId, `Created an assignment: ${data.title}`);
        return { success: true };
    },

    async deleteAssignment(id) {
        const { error } = await supabase
            .from('assignments')
            .delete()
            .eq('id', id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    }
};
