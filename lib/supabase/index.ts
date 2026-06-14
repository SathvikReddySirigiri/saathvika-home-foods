/**
 * Server-side Supabase helpers (cookies session, admin, getCurrentUser/Profile).
 * Import only from Server Components, Route Handlers, and Server Actions.
 */
export {
  createServerSupabaseAdmin,
  createServerSupabaseClient,
  getCurrentProfile,
  getCurrentUser,
} from "./server";

/** Client-side Supabase helper — import from @/lib/supabase/browser in Client Components. */
export { createBrowserSupabaseClient } from "./browser";
