// Supabase configuration
const SUPABASE_URL = 'https://yfhawxcvskrrvckzbwti.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3EaU9Lgq1721b-4itv03qg_7JCCy0mo';

// Initialize the client (assuming supabase is loaded via CDN globally)
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Secondary client for creating students without logging out the host
export const adminSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storageKey: 'temp_admin_auth',
        persistSession: false,
        autoRefreshToken: false
    }
});

