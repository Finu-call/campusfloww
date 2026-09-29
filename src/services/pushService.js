import { supabase } from './supabaseClient.js';

const VAPID_PUBLIC_KEY = 'BHUwiIsM7MX3A1cQ_bEKuNADLfh4sCR1G_g1em050f05HeGGWCtWuPMPkMxtdw1GInkpQLbKrGJK4f0zkMYwIgM';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

export const pushService = {
    supported() {
        return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    },

    async register() {
        if (!this.supported() || VAPID_PUBLIC_KEY.startsWith('REPLACE_')) {
            return { success: false, message: 'Push notifications need the VAPID public key configured.' };
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return { success: false, message: 'Notification permission was not granted.' };
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        const userResult = await supabase.auth.getUser();
        const user = userResult.data.user;
        if (!user) return { success: false, message: 'Please log in first.' };

        const json = subscription.toJSON();
        const { error } = await supabase.from('campus_push_subscriptions').upsert({
            user_id: user.id,
            endpoint: json.endpoint,
            p256dh: json.keys?.p256dh,
            auth: json.keys?.auth
        }, { onConflict: 'endpoint' });

        if (error) return { success: false, message: error.message };
        return { success: true };
    }
};