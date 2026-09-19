import { supabase } from './supabaseClient.js';
import { classroomService } from './classroomService.js';

export const resourceService = {
    async getResources(classroomId) {
        const { data, error } = await supabase
            .from('resources')
            .select('*, profiles(name)')
            .eq('classroom_id', classroomId)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error(error);
            return [];
        }
        
        // Generate signed URLs for downloads
        for (const res of data) {
            const { data: urlData } = await supabase
                .storage
                .from('resources')
                .createSignedUrl(res.file_path, 60 * 60); // 1 hour expiry
                
            res.downloadUrl = urlData?.signedUrl;
        }
        
        return data;
    },
    
    async addResource(classroomId, userId, file, data) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${classroomId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('resources')
            .upload(filePath, file);
            
        if (uploadError) return { success: false, message: uploadError.message };
        
        // 2. Insert DB Record
        const { data: newRes, error: dbError } = await supabase
            .from('resources')
            .insert([{
                classroom_id: classroomId,
                uploaded_by: userId,
                title: data.title,
                subject: data.subject,
                category: data.category,
                description: data.description || '',
                file_path: filePath,
                file_size: data.size,
                file_type: data.type
            }])
            .select()
            .single();
            
        if (dbError) return { success: false, message: dbError.message };
        
        await classroomService.logActivity(classroomId, userId, `Uploaded a resource: ${data.title}`);
        return { success: true, resource: newRes };
    },
    
    async deleteResource(id, filePath) {
        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage
            .from('resources')
            .remove([filePath]);
            
        if (storageError) console.error("Storage delete error:", storageError);
        
        // 2. Delete DB record
        const { error: dbError } = await supabase
            .from('resources')
            .delete()
            .eq('id', id);
            
        if (dbError) return { success: false, message: dbError.message };
        return { success: true };
    }
};
