import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey?.startsWith("sb_secret_")) {
    throw new Error("Supabase server configuration is missing or invalid");
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
