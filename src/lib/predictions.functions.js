import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware.js";

/**
 * Public predictions feed. VIP rows are returned as locked teasers with the
 * sensitive tip/odds stripped server-side, so paid content is never sent to
 * non-entitled visitors even though the match row is still shown (blurred).
 *
 * @param {Request} [_request]  (unused; kept for a uniform signature)
 */
export async function getPublicPredictions(_request) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("predictions")
    .select("id,day,time,home,away,tip,odds,result,vip,sort_order,updated_at")
    .order("day")
    .order("sort_order");
  if (error) throw new Error("Could not load predictions");
  return (data ?? []).map((p) => (p.vip ? { ...p, tip: "VIP", odds: "—" } : p));
}

/**
 * Predictions feed for a signed-in user. If the user has an active VIP
 * subscription, full VIP tip/odds are returned; otherwise VIP rows are masked
 * exactly like the public feed. Also reports the VIP entitlement flag.
 *
 * @param {Request} request
 */
export async function getEntitledPredictions(request) {
  const { supabase, userId } = await requireSupabaseAuth(request);

  const { data: active } = await supabase.rpc("has_active_subscription", {
    _user_id: userId,
  });
  const isActive = !!active;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("predictions")
    .select("id,day,time,home,away,tip,odds,result,vip,sort_order,updated_at")
    .order("day")
    .order("sort_order");
  if (error) throw new Error("Could not load predictions");

  const predictions = (data ?? []).map((p) =>
    p.vip && !isActive ? { ...p, tip: "VIP", odds: "—" } : p,
  );
  return { active: isActive, predictions };
}
