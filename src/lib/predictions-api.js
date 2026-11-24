import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPublicPredictions, getEntitledPredictions } from "@/lib/predictions.functions";
export const DAYS = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
export async function fetchPredictions() {
    return (await getPublicPredictions());
}
/** Signed-in feed: returns VIP-unlocked rows when the user has an active subscription. */
export async function fetchEntitledPredictions() {
    return (await getEntitledPredictions());
}
/**
 * Admin-only feed queried directly (RLS grants admins full rows, including VIP
 * tip/odds needed for editing). Only usable by an authenticated admin session.
 */
export async function fetchAdminPredictions() {
    const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .order("day")
        .order("sort_order");
    if (error)
        throw error;
    return (data ?? []);
}
export async function fetchWinningHistory() {
    const { data, error } = await supabase
        .from("winning_history")
        .select("*")
        .order("sort_order");
    if (error)
        throw error;
    return (data ?? []);
}
export const predictionsQueryOptions = () => queryOptions({ queryKey: ["predictions"], queryFn: fetchPredictions });
export const entitledPredictionsQueryOptions = () => queryOptions({ queryKey: ["predictions", "entitled"], queryFn: fetchEntitledPredictions });
export const adminPredictionsQueryOptions = () => queryOptions({ queryKey: ["predictions", "admin"], queryFn: fetchAdminPredictions });
export const winningHistoryQueryOptions = () => queryOptions({ queryKey: ["winning_history"], queryFn: fetchWinningHistory });
export function groupByDay(rows) {
    const map = {};
    for (const d of DAYS)
        map[d] = [];
    for (const r of rows) {
        if (DAYS.includes(r.day))
            map[r.day].push(r);
    }
    return map;
}
export function groupByDate(rows) {
    const order = [];
    const map = new Map();
    for (const r of rows) {
        if (!map.has(r.date)) {
            map.set(r.date, []);
            order.push(r.date);
        }
        map.get(r.date).push(r);
    }
    return order.map((date) => ({ date, games: map.get(date) }));
}
export const formatKsh = (n) => `KSH ${n.toLocaleString()}`;
