import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" }
    });

  try {
    if (req.method !== "POST") return json({ error: "POST method required" }, 405);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Authorization required" }, 401);

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return json({ error: "Invalid authorization token" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Invalid session" }, 401);

    const userId = authData.user.id;

    // Delete the authenticated user. Foreign keys with ON DELETE CASCADE
    // remove related profile/membership data where configured.
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      return json({ error: deleteError.message }, 400);
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Account deletion failed" }, 500);
  }
});
