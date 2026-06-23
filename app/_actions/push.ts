"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PushResult = { error?: string };

export async function subscribePush(sub: {
  endpoint: string;
  p256dh: string;
  auth: string;
}): Promise<PushResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      { user_id: user.id, ...sub },
      { onConflict: "user_id,endpoint" },
    );

  return error ? { error: error.message } : {};
}

export async function unsubscribePush(endpoint: string): Promise<PushResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  return error ? { error: error.message } : {};
}
