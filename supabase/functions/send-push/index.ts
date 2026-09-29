import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST method required" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const callerId = authData.user.id;
    const body = await req.json();

    const userId = body.user_id;
    const classroomId = body.classroom_id;
    const title = body.title || "CampusFlow";
    const message = body.message || "You have a new notification.";
    const route = body.route || "#notifications";
    const type = body.type || "classroom";

    if (!userId && !classroomId) {
      return new Response(JSON.stringify({ error: "user_id or classroom_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (classroomId) {
      const { data: classroom, error: classroomError } = await supabase
        .from("classrooms")
        .select("id, host_id")
        .eq("id", classroomId)
        .single();

      if (classroomError || !classroom || classroom.host_id !== callerId) {
        return new Response(JSON.stringify({ error: "Only the classroom host can create classroom notifications" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    webpush.setVapidDetails(
      `mailto:${Deno.env.get("VAPID_CONTACT_EMAIL")}`,
      Deno.env.get("VAPID_PUBLIC_KEY")!,
      Deno.env.get("VAPID_PRIVATE_KEY")!
    );

    let recipientIds: string[] = [];

    if (classroomId) {
      const { data: members, error } = await supabase
        .from("classroom_members")
        .select("user_id")
        .eq("classroom_id", classroomId)
        .eq("status", "active");

      if (error) throw error;
      recipientIds = (members || []).map((m) => m.user_id).filter(Boolean);
    } else {
      recipientIds = [userId];
    }

    if (!recipientIds.length) {
      return new Response(JSON.stringify({ success: true, sent: 0, notifications: 0 }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const notificationRows = recipientIds.map((recipientId) => ({
      user_id: recipientId,
      classroom_id: classroomId || null,
      type,
      title,
      message,
      route,
      is_read: false
    }));

    const { error: notificationError } = await supabase
      .from("campus_notifications")
      .insert(notificationRows);

    if (notificationError) throw notificationError;

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("campus_push_subscriptions")
      .select("id, user_id, endpoint, p256dh, auth")
      .in("user_id", recipientIds);

    if (subscriptionError) throw subscriptionError;

    let sent = 0;
    let removed = 0;
    const payload = JSON.stringify({ title, message, route });

    for (const subscription of subscriptions || []) {
      try {
        await webpush.sendNotification({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        }, payload);
        sent++;
      } catch (error: any) {
        console.error("Push failed:", error?.statusCode, error?.message);
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await supabase.from("campus_push_subscriptions").delete().eq("id", subscription.id);
          removed++;
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      sent,
      removed,
      notifications: recipientIds.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
