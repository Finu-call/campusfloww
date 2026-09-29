import { supabase, adminSupabase } from './supabaseClient.js';

export const authService = {
    async getCurrentUser() {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return null;
        
        const userId = session.user.id;
        
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (profileError || !profile) return null;
        
        return {
            id: userId,
            email: session.user.email,
            name: profile.name,
            role: profile.role,
            studentId: profile.student_id,
            avatarUrl: profile.avatar_url
        };
    },
    
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
            
        if (error) {
            return { success: false, message: error.message };
        }
        
        const user = await this.getCurrentUser();
        return { success: true, user: user };
    },
    
    async signupHost(name, email, password) {
        // 1. Create Auth User with metadata for the DB Trigger
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    role: 'host'
                }
            }
        });
            
        if (error) {
            return { success: false, message: error.message };
        }
        
        // Note: We no longer manually insert into 'profiles' here.
        // The PostgreSQL trigger 'on_auth_user_created' automatically creates the profile row 
        // securely, bypassing RLS issues related to email confirmation states.
        
        return { success: true };
    },
    
    async createStudent(name, email, password, studentId, classroomId) {
        // We use the secondary admin client to create the student without logging out the host
        const { data: signUpData, error: signUpError } = await adminSupabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    role: 'student',
                    student_id: studentId
                }
            }
        });

        if (signUpError) {
            return { success: false, message: signUpError.message };
        }

        // The Postgres trigger automatically creates the profile.
        // Now, add the student to the classroom using the HOST's session (main supabase client)
        if (classroomId && signUpData.user) {
            const { error: memberError } = await supabase
                .from('classroom_members')
                .insert({
                    classroom_id: classroomId,
                    user_id: signUpData.user.id,
                    status: 'active'
                });
                
            if (memberError) {
                return { success: false, message: 'Student created, but failed to add to classroom: ' + memberError.message };
            }
        }

        return { success: true, user: signUpData.user };
    },
    
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
        }
    },

    async resetPasswordForEmail(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/#reset-password',
        });
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true };
    },

    async updatePassword(newPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true };
    },

    async deleteAccount() {
        // Deleting Auth users requires a Service Role key on the backend
        // For a frontend prototype, this might fail unless an Edge Function handles it.
        // If Supabase allows self-deletion (it generally doesn't), we try:
        // Actually, Supabase doesn't support self-deletion via frontend without an Edge function.
        // We will mock this or provide a stub.
        return { success: false, message: 'Account deletion must be configured via an Edge Function in production.' };
    }
};
