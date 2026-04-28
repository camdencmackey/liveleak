// lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  // Server-only Supabase client. Never import this from client components.
  return createClient(url, serviceKey, {
    auth: {
      persistSession: false
    }
  });
}