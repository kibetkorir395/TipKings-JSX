import { supabase } from "@/integrations/supabase/client";
import { getPublicPredictions, getEntitledPredictions } from "@/lib/predictions.functions";

/** @typedef {"Wed" | "Thu" | "Fri" | "Sat" | "Sun" | "Mon" | "Tue"} Day */
/** @typedef {"won" | "lost" | "pending"} Result */

export const DAYS = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];

/**
 * @typedef {Object} PredictionRow
 * @property {string} id
 * @property {string} day
 * @property {string} time
 * @property {string} home
 * @property {string} away
 * @property {string} tip
 * @property {string} odds
 * @property {string} result
 * @property {boolean} vip
 * @property {number} sort_order
 * @property {string} updated_at
 */

/**
 * @typedef {Object} HistoryRow
 * @property {string} id
 * @property {string} date
 * @property {string} time
 * @property {string} home
 * @property {string} away
 * @property {string} tip
 * @property {string} odds
 * @property {string} score
 * @property {number} sort_order
 * @property {string} updated_at
 */

/**
 * @param {Request} [request]
 * @returns {Promise<PredictionRow[]>}
 */
export async function fetchPredictions(request) {
  return await getPublicPredictions(request);
}

/**
 * @typedef {Object} EntitledPredictions
 * @property {boolean} active
 * @property {PredictionRow[]} predictions
 */

/**
 * Signed-in feed: returns VIP-unlocked rows when the user has an active subscription.
 * @param {Request} request
 * @returns {Promise<EntitledPredictions>}
 */
export async function fetchEntitledPredictions(request) {
  return await getEntitledPredictions(request);
}

/**
 * Admin-only feed queried directly (RLS grants admins full rows, including VIP
 * tip/odds needed for editing). Only usable by an authenticated admin session.
 * @returns {Promise<PredictionRow[]>}
 */
export async function fetchAdminPredictions() {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .order("day")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/** @returns {Promise<HistoryRow[]>} */
export async function fetchWinningHistory() {
  const { data, error } = await supabase.from("winning_history").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/**
 * Plain React Query options objects. Compatible with `queryOptions(...)` if you
 * still use it, but no longer import it here.
 * @param {Request} [request]
 */
export const predictionsQueryOptions = (request) => ({
  queryKey: ["predictions"],
  queryFn: () => fetchPredictions(request),
});

/** @param {Request} request */
export const entitledPredictionsQueryOptions = (request) => ({
  queryKey: ["predictions", "entitled"],
  queryFn: () => fetchEntitledPredictions(request),
});

export const adminPredictionsQueryOptions = () => ({
  queryKey: ["predictions", "admin"],
  queryFn: () => fetchAdminPredictions(),
});

export const winningHistoryQueryOptions = () => ({
  queryKey: ["winning_history"],
  queryFn: () => fetchWinningHistory(),
});

/**
 * @param {PredictionRow[]} rows
 * @returns {Record<Day, PredictionRow[]>}
 */
export function groupByDay(rows) {
  /** @type {Record<Day, PredictionRow[]>} */
  const map = {};
  for (const d of DAYS) map[d] = [];
  for (const r of rows) {
    if (DAYS.includes(r.day)) map[r.day].push(r);
  }
  return map;
}

/**
 * @typedef {Object} HistoryGroup
 * @property {string} date
 * @property {HistoryRow[]} games
 */

/**
 * @param {HistoryRow[]} rows
 * @returns {HistoryGroup[]}
 */
export function groupByDate(rows) {
  /** @type {string[]} */
  const order = [];
  /** @type {Map<string, HistoryRow[]>} */
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
