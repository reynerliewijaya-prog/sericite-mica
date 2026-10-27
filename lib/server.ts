import "server-only";
import { allowedAdmin } from "./admin-allowlist";
import { createClient } from "@supabase/supabase-js";
export function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error("Service not configured");
  return value;
}
export function db() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function sameOrigin(req: Request) {
  return req.headers.get("origin") === env("APP_ORIGIN");
}
export async function admin(req: Request) {
  const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return false;
  const { data, error } = await db().auth.getUser(token);
  return (
    !error &&
    allowedAdmin(
      data.user?.email,
      Boolean(data.user?.email_confirmed_at),
      process.env.ADMIN_EMAILS,
      process.env.ADMIN_EMAIL,
    )
  );
}
export const privateHeaders = { "Cache-Control": "no-store" };
