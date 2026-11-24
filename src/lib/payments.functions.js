import { z } from "zod";
import { plans, planAmount } from "@/data/predictions";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware.js";

/** @typedef {"NGN" | "KES"} Currency */

/**
 * Extract the client IP from a standard Request, honoring X-Forwarded-For.
 * Replaces TanStack's getRequestIP({ xForwardedFor: true }).
 * @param {Request} request
 * @returns {string | undefined}
 */
function getRequestIP(request) {
  if (!request) return undefined;
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? request.headers.get("cf-connecting-ip") ?? undefined;
}

/**
 * Extract the request host (e.g. "example.com").
 * Replaces TanStack's getRequestHost().
 * @param {Request} request
 * @returns {string | undefined}
 */
function getRequestHost(request) {
  if (!request) return undefined;
  const host = request.headers.get("host");
  if (host) return host;
  try {
    return new URL(request.url).host;
  } catch {
    return undefined;
  }
}

/** Free IP geolocation — returns the visitor's ISO country code + currency. */
/**
 * @param {Request} request
 * @returns {Promise<{ country: string, currency: Currency }>}
 */
export async function detectCountry(request) {
  /** @type {{ country: string, currency: Currency }} */
  const fallback = { country: "KE", currency: "KES" };
  try {
    const ip = getRequestIP(request);
    if (!ip || ip === "127.0.0.1" || ip === "::1") return fallback;

    // Free, no-key geolocation service
    const res = await fetch(`https://ipapi.co/${ip}/country/`, {
      headers: { "User-Agent": "tipkings/1.0" },
    });
    if (!res.ok) return fallback;
    const code = (await res.text()).trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) return fallback;

    /** @type {Currency} */
    const currency = code === "NG" ? "NGN" : "KES";
    return { country: code, currency };
  } catch {
    return fallback;
  }
}

/**
 * @param {string | undefined} ip
 * @returns {Promise<Currency>}
 */
async function detectCurrencyFromIp(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1") return "KES";
  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`);
    if (!res.ok) return "KES";
    const code = (await res.text()).trim().toUpperCase();
    return code === "NG" ? "NGN" : "KES";
  } catch {
    return "KES";
  }
}

const initializeInputSchema = z.object({
  planId: z.string().min(1).max(40),
  email: z.string().email().max(255),
  name: z.string().min(1).max(120),
  currency: z.enum(["NGN", "KES"]).optional(),
});

/**
 * Initialize a Korapay charge and return the hosted checkout URL.
 * @param {Request} request
 * @param {unknown} input
 */
export async function initializeKorapayCharge(request, input) {
  const { supabase, userId } = await requireSupabaseAuth(request);
  const data = initializeInputSchema.parse(input);

  const secret = process.env.KORAPAY_SECRET_KEY;
  if (!secret) throw new Error("Payment provider is not configured.");

  const plan = plans.find((p) => p.id === data.planId);
  if (!plan) throw new Error("Invalid plan selected.");

  // Use the client-selected currency when supplied, otherwise auto-detect.
  const ip = getRequestIP(request);
  const currency = data.currency ?? (await detectCurrencyFromIp(ip));
  const amount = planAmount(plan, currency);

  const host = getRequestHost(request);
  const origin = host ? `https://${host}` : "";
  const reference = `tk_${plan.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Record a pending subscription tied to the signed-in user.
  const { error: subErr } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_id: plan.id,
    reference,
    status: "pending",
    currency,
    amount,
  });
  if (subErr) {
    console.error("subscription insert failed", subErr.message);
    throw new Error("Could not start payment. Please try again.");
  }

  const res = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      reference,
      narration: `TipKings ${plan.name} VIP subscription`,
      redirect_url: `${origin}/payment-status?ref=${reference}`,
      notification_url: `${origin}/api/public/korapay-webhook`,
      customer: { email: data.email, name: data.name },
      metadata: { plan_id: plan.id, plan_name: plan.name, user_id: userId },
    }),
  });

  /** @type {{ status?: boolean, message?: string, data?: { checkout_url?: string } } | null} */
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.status || !body.data?.checkout_url) {
    console.error("Korapay init failed", res.status, body?.message);
    throw new Error(body?.message || "Could not start payment. Please try again.");
  }

  return { checkoutUrl: body.data.checkout_url, reference, currency, amount };
}

const verifyInputSchema = z.object({
  reference: z.string().min(1).max(120),
});

/**
 * Verify a charge status by reference (used by the return/status page).
 * @param {Request} _request  (unused; kept for a uniform signature)
 * @param {unknown} input
 */
export async function verifyKorapayCharge(_request, input) {
  const data = verifyInputSchema.parse(input);

  const secret = process.env.KORAPAY_SECRET_KEY;
  if (!secret) throw new Error("Payment provider is not configured.");

  const res = await fetch(
    `https://api.korapay.com/merchant/api/v1/charges/${encodeURIComponent(data.reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );

  /** @type {{ status?: boolean, data?: { status?: string, amount?: number, currency?: string } } | null} */
  const body = await res.json().catch(() => null);

  const status = body?.data?.status ?? "pending";
  return {
    status,
    success: status === "success",
    amount: body?.data?.amount ?? null,
    currency: body?.data?.currency ?? null,
  };
}
