// Static client-side stub (replaces TanStack Start server functions)
/*export const savePrediction = async () => ({ data: [], predictions: [], subscriptions: [], payments: [], stats: {}, success: true });
export const deletePrediction = async () => ({ data: [], predictions: [], subscriptions: [], payments: [], stats: {}, success: true });
export const saveHistory = async () => ({ data: [], predictions: [], subscriptions: [], payments: [], stats: {}, success: true });
export const deleteHistory = async () => ({ data: [], predictions: [], subscriptions: [], payments: [], stats: {}, success: true });
*/

import { z } from "zod";

/**
 * Admin guard. Replaces the requireAdmin middleware.
 * Throws if the user does not have the admin role.
 */
async function assertAdmin(supabase, userId) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error("Could not verify permissions");
  if (!data) throw new Error("Forbidden: admin role required");
}

export class ConflictError extends Error {
  conflict = true;
  constructor() {
    super("This item was changed by someone else since you opened it. Refresh and try again.");
  }
}

const text = (max = 255) => z.string().trim().min(1).max(max);

const predictionSchema = z.object({
  id: z.string().uuid().optional(),
  expectedUpdatedAt: z.string().optional(),
  day: z.enum(["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"]),
  time: text(20),
  home: text(120),
  away: text(120),
  tip: text(120),
  odds: text(20),
  result: z.enum(["pending", "won", "lost"]),
  vip: z.boolean(),
  sort_order: z.number().int().min(0).max(100000),
});

const historySchema = z.object({
  id: z.string().uuid().optional(),
  expectedUpdatedAt: z.string().optional(),
  date: text(120),
  time: text(20),
  home: text(120),
  away: text(120),
  tip: text(120),
  odds: text(20),
  score: text(20),
  sort_order: z.number().int().min(0).max(100000),
});

const idSchema = z.object({ id: z.string().uuid() });

/**
 * Save (insert or update) a prediction.
 * @param {{ supabase: any, userId: string }} ctx
 * @param {unknown} input
 */
export async function savePrediction({ supabase, userId }, input) {
  await assertAdmin(supabase, userId);
  const data = predictionSchema.parse(input);
  const { id, expectedUpdatedAt, ...payload } = data;

  if (id) {
    let query = supabase.from("predictions").update(payload).eq("id", id);
    if (expectedUpdatedAt) query = query.eq("updated_at", expectedUpdatedAt);
    const { data: rows, error } = await query.select("id");
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) throw new ConflictError();
    return { ok: true, id };
  }

  const { data: row, error } = await supabase
    .from("predictions")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { ok: true, id: row.id };
}

/**
 * Delete a prediction.
 * @param {{ supabase: any, userId: string }} ctx
 * @param {unknown} input
 */
export async function deletePrediction({ supabase, userId }, input) {
  await assertAdmin(supabase, userId);
  const data = idSchema.parse(input);
  const { error } = await supabase.from("predictions").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/**
 * Save (insert or update) a winning history entry.
 * @param {{ supabase: any, userId: string }} ctx
 * @param {unknown} input
 */
export async function saveHistory({ supabase, userId }, input) {
  await assertAdmin(supabase, userId);
  const data = historySchema.parse(input);
  const { id, expectedUpdatedAt, ...payload } = data;

  if (id) {
    let query = supabase.from("winning_history").update(payload).eq("id", id);
    if (expectedUpdatedAt) query = query.eq("updated_at", expectedUpdatedAt);
    const { data: rows, error } = await query.select("id");
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) throw new ConflictError();
    return { ok: true, id };
  }

  const { data: row, error } = await supabase
    .from("winning_history")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { ok: true, id: row.id };
}

/**
 * Delete a winning history entry.
 * @param {{ supabase: any, userId: string }} ctx
 * @param {unknown} input
 */
export async function deleteHistory({ supabase, userId }, input) {
  await assertAdmin(supabase, userId);
  const data = idSchema.parse(input);
  const { error } = await supabase.from("winning_history").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
