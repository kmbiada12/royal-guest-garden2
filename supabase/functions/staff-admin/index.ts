// =====================================================================
// Royal Guest Garden 2 — Edge Function `staff-admin`
// Staff management for the back-office. Everything that needs the
// service-role key (reading auth users, inviting, deleting) happens here,
// so that key never reaches the browser.
//
// POST { action: "list" }
// POST { action: "invite", email, role }        role: "admin" | "editor"
// POST { action: "set_role", userId, role }
// POST { action: "remove", userId }
//
// The caller must be an admin (public.is_admin(), which also requires the
// two-factor step when the caller has enabled it). The database refuses
// to remove or demote the last admin (trigger trg_staff_last_admin).
//
// Secrets / env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
// (provided by Supabase), ADMIN_URL (invite link target, default
// http://localhost:3004), ADMIN_ORIGINS (CORS, comma-separated).
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2.117.3";

const ADMIN_URL = (Deno.env.get("ADMIN_URL") ?? "http://localhost:3004").replace(/\/+$/, "");
const ALLOWED_ORIGINS = (Deno.env.get("ADMIN_ORIGINS") ??
  "http://localhost:3004,http://127.0.0.1:3004,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const ROLES = ["admin", "editor"] as const;
type Role = (typeof ROLES)[number];

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(req: Request, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && v.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const isRole = (v: unknown): v is Role => typeof v === "string" && (ROLES as readonly string[]).includes(v);
const isUuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** Database errors → messages for the back-office (French). */
function friendly(message: string): string {
  if (/last admin/i.test(message)) return "Impossible : il doit toujours rester au moins un administrateur.";
  if (/already been registered|already registered|already exists/i.test(message)) {
    return "Un compte existe déjà pour cette adresse.";
  }
  return "L'opération a échoué. Réessayez ou consultez les journaux.";
}

type AdminClient = ReturnType<typeof createClient>;

async function findUserByEmail(admin: AdminClient, email: string) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { error: error.message, user: null };
    const user = data.users.find((u) => (u.email ?? "").toLowerCase() === email);
    if (user) return { error: null, user };
    if (data.users.length < 200) break;
  }
  return { error: null, user: null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Méthode non autorisée." }, 405);

  const origin = req.headers.get("Origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return json(req, { error: "Origine non autorisée." }, 403);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json(req, { error: "Non authentifié." }, 401);

  // Caller check runs under the caller's own identity (RLS + two-factor).
  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: userData } = await caller.auth.getUser();
  const me = userData?.user;
  if (!me) return json(req, { error: "Non authentifié." }, 401);
  const { data: isAdmin, error: roleError } = await caller.rpc("is_admin");
  if (roleError || isAdmin !== true) {
    return json(req, { error: "Réservé aux administrateurs (avec la double authentification si elle est activée)." }, 403);
  }

  // Privileged client — never exposed to the browser.
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 4096) return json(req, { error: "Requête trop volumineuse." }, 413);
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return json(req, { error: "Requête invalide." }, 400);
  }

  // ── list ────────────────────────────────────────────────────────────
  if (body.action === "list") {
    const { data: staff, error } = await admin
      .from("staff")
      .select("user_id, role, created_at, invited_by")
      .order("created_at");
    if (error) return json(req, { error: friendly(error.message) }, 500);

    const users = new Map<string, { email?: string; last_sign_in_at?: string | null; email_confirmed_at?: string | null; factors?: { status: string }[] }>();
    for (let page = 1; page <= 20; page++) {
      const { data, error: listError } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (listError) return json(req, { error: friendly(listError.message) }, 500);
      data.users.forEach((u) => users.set(u.id, u as never));
      if (data.users.length < 200) break;
    }

    return json(req, {
      staff: (staff ?? []).map((s) => {
        const u = users.get(s.user_id);
        return {
          userId: s.user_id,
          email: u?.email ?? "(compte supprimé)",
          role: s.role,
          createdAt: s.created_at,
          invitedBy: s.invited_by ? users.get(s.invited_by)?.email ?? null : null,
          lastSignInAt: u?.last_sign_in_at ?? null,
          confirmed: Boolean(u?.email_confirmed_at),
          twoFactor: (u?.factors ?? []).some((f) => f.status === "verified"),
          isMe: s.user_id === me.id,
        };
      }),
    });
  }

  // ── invite ──────────────────────────────────────────────────────────
  if (body.action === "invite") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!isEmail(email)) return json(req, { error: "Adresse e-mail invalide." }, 422);
    if (!isRole(body.role)) return json(req, { error: "Rôle invalide." }, 422);

    const existing = await findUserByEmail(admin, email);
    if (existing.error) return json(req, { error: friendly(existing.error) }, 500);

    if (existing.user) {
      // Account already exists: never re-invite or delete it.
      const { data: row } = await admin.from("staff").select("role").eq("user_id", existing.user.id).maybeSingle();
      if (row) return json(req, { error: "Cette personne fait déjà partie du personnel." }, 409);
      const { error: staffError } = await admin
        .from("staff")
        .insert({ user_id: existing.user.id, role: body.role, invited_by: me.id });
      if (staffError) return json(req, { error: friendly(staffError.message) }, 500);
      // Lets them (re)set a password and sign in.
      await admin.auth.resetPasswordForEmail(email, { redirectTo: `${ADMIN_URL}/mot-de-passe` });
      return json(req, { ok: true, existingAccount: true });
    }

    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${ADMIN_URL}/mot-de-passe`,
    });
    if (inviteError || !invited?.user) {
      return json(req, { error: friendly(inviteError?.message ?? "") }, 409);
    }

    const { error: staffError } = await admin
      .from("staff")
      .insert({ user_id: invited.user.id, role: body.role, invited_by: me.id });
    if (staffError) {
      // Only the account created just above is rolled back.
      await admin.auth.admin.deleteUser(invited.user.id);
      return json(req, { error: friendly(staffError.message) }, 500);
    }
    return json(req, { ok: true });
  }

  // ── set_role ────────────────────────────────────────────────────────
  if (body.action === "set_role") {
    if (!isUuid(body.userId)) return json(req, { error: "Compte invalide." }, 422);
    if (!isRole(body.role)) return json(req, { error: "Rôle invalide." }, 422);
    const { error } = await admin.from("staff").update({ role: body.role }).eq("user_id", body.userId);
    if (error) return json(req, { error: friendly(error.message) }, 409);
    return json(req, { ok: true });
  }

  // ── remove ──────────────────────────────────────────────────────────
  if (body.action === "remove") {
    if (!isUuid(body.userId)) return json(req, { error: "Compte invalide." }, 422);
    if (body.userId === me.id) return json(req, { error: "Vous ne pouvez pas supprimer votre propre compte." }, 409);
    // Deleting the login cascades to the staff row (last-admin guard applies).
    const { error } = await admin.auth.admin.deleteUser(body.userId);
    if (error) return json(req, { error: friendly(error.message) }, 409);
    return json(req, { ok: true });
  }

  return json(req, { error: "Action inconnue." }, 400);
});
