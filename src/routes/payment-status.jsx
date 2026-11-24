const useServerFn = (fn) => fn;
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyKorapayCharge } from "@/lib/payments.functions";
export const Route = createFileRoute("/payment-status")({
    ssr: false,
    head: () => ({ meta: [{ title: "Payment Status — TipKings" }] }),
    validateSearch: (s) => ({ ref: typeof s.ref === "string" ? s.ref : "" }),
    component: PaymentStatusPage,
});
function PaymentStatusPage() {
    const { ref } = useSearch({ from: "/payment-status" });
    const verify = useServerFn(verifyKorapayCharge);
    const { data, isLoading } = useQuery({
        queryKey: ["korapay-verify", ref],
        queryFn: () => verify({ data: { reference: ref } }),
        enabled: !!ref,
        refetchInterval: (q) => (q.state.data?.status === "pending" ? 3000 : false),
    });
    const status = !ref ? "error" : isLoading ? "loading" : data?.success ? "success" : data?.status;
    return (<div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="size-6 text-primary"/>
          <span className="text-lg font-extrabold tracking-tight">TipKings</span>
        </Link>

        {status === "loading" && (<>
            <Loader2 className="mx-auto size-10 animate-spin text-primary"/>
            <p className="mt-4 font-semibold">Confirming your payment…</p>
          </>)}
        {status === "success" && (<>
            <CheckCircle2 className="mx-auto size-12 text-primary"/>
            <h1 className="mt-3 text-lg font-bold">Payment successful!</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your VIP access is now active. Welcome aboard.</p>
          </>)}
        {status === "pending" && (<>
            <Clock className="mx-auto size-12 text-vip"/>
            <h1 className="mt-3 text-lg font-bold">Payment pending</h1>
            <p className="mt-1 text-sm text-muted-foreground">We're waiting for confirmation. This page updates automatically.</p>
          </>)}
        {(status === "error" || status === "failed" || status === "expired") && (<>
            <XCircle className="mx-auto size-12 text-destructive"/>
            <h1 className="mt-3 text-lg font-bold">Payment not completed</h1>
            <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
          </>)}

        <Button asChild className="mt-6 w-full">
          <Link to="/">Back to predictions</Link>
        </Button>
      </div>
    </div>);
}
