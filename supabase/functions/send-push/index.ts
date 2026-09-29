import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const userId = body.user_id;
    const title = body.title || 'CampusFlow';
    const message = body.message || 'You have a new notification.';
    const route = body.route || '#notifications';

    if (!userId) return new Response(JSON.stringify({ error: 'user_id is required' }), { status: 400 });

    webpush.setVapidDetails(
      'mailto:' + Deno.env.get('VAPID_CONTACT_EMAIL'),
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    );

    const { data: subscriptions, error } = await supabase
      .from('campus_push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', userId);

    if (error) throw error;

    const payload = JSON.stringify({ title, message, route });

    for (const sub of subscriptions || []) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth }
        }, payload);
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await supabase.from('campus_push_subscriptions').delete().eq('id', sub.id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});