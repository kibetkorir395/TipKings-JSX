import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, History, Tag, LogIn, LogOut, ShieldCheck, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { DaySelector } from "@/components/DaySelector";
import { PredictionsTable } from "@/components/PredictionsTable";
import { WinningHistory } from "@/components/WinningHistory";
import { Pricing } from "@/components/Pricing";
import { StatsBanner } from "@/components/StatsBanner";
import { VipBanner } from "@/components/VipBanner";
import { LoginModal } from "@/components/LoginModal";
import { PaymentModal } from "@/components/PaymentModal";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { predictionsQueryOptions, entitledPredictionsQueryOptions, winningHistoryQueryOptions, groupByDay, groupByDate, } from "@/lib/predictions-api";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "TipKings — Kenya's #1 Football Prediction Tips" },
            { name: "description", content: "Daily free & VIP football betting tips with a 95% success rate. Winning history, premium picks, and instant M-Pesa payments." },
            { property: "og:title", content: "TipKings — Kenya's #1 Football Prediction Tips" },
            { property: "og:description", content: "Daily free & VIP football betting tips with a 95% success rate." },
        ],
    }),
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(predictionsQueryOptions());
        context.queryClient.ensureQueryData(winningHistoryQueryOptions());
    },
    component: Index,
});
const tabs = [
    { id: "predictions", label: "Predictions", icon: Trophy },
    { id: "history", label: "Winning History", icon: History },
    { id: "pricing", label: "Pricing", icon: Tag },
];
function Index() {
    const [tab, setTab] = useState("predictions");
    const [day, setDay] = useState("Wed");
    const [loginOpen, setLoginOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);
    const [payPlan, setPayPlan] = useState("7day");
    const { session, signOut } = useAuth();
    const { data: publicPreds = [] } = useQuery(predictionsQueryOptions());
    const { data: entitled } = useQuery({ ...entitledPredictionsQueryOptions(), enabled: !!session });
    const { data: history = [] } = useQuery(winningHistoryQueryOptions());
    const predictions = session && entitled?.predictions ? entitled.predictions : publicPreds;
    const isVip = !!entitled?.active;
    const byDay = groupByDay(predictions);
    const historyGroups = groupByDate(history);
    const openPayment = (planId = "7day") => {
        if (!session) {
            toast.info("Please sign in to subscribe and unlock VIP tips.");
            setLoginOpen(true);
            return;
        }
        setPayPlan(planId);
        setPayOpen(true);
    };
    return (<div className="min-h-screen bg-background pb-16">
      <Toaster position="top-center"/>

      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-primary"/>
            <span className="text-lg font-extrabold tracking-tight">TipKings</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencySwitch />
            {session ? (<Button size="sm" variant="outline" onClick={() => signOut()}>
                <LogOut className="size-4"/> Logout
              </Button>) : (<Button size="sm" variant="outline" onClick={() => setLoginOpen(true)}>
                <LogIn className="size-4"/> Sign In
              </Button>)}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-5">
        <StatsBanner />
        {isVip ? (<div className="flex items-center gap-3 rounded-2xl bg-vip/15 p-4 text-vip">
            <Crown className="size-6 shrink-0"/>
            <p className="text-sm font-semibold">Your VIP membership is active — all premium picks are unlocked below.</p>
          </div>) : (<VipBanner onClick={() => openPayment("30day")}/>)}

        <nav className="flex gap-1.5 rounded-xl border border-border bg-card p-1.5">
          {tabs.map((t) => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm", tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
              <t.icon className="size-4"/>
              <span>{t.label}</span>
            </button>))}
        </nav>

        {tab === "predictions" && (<div className="space-y-4">
            <DaySelector active={day} onChange={setDay}/>
            <PredictionsTable predictions={byDay[day]} onUnlock={() => openPayment("7day")}/>
            {!isVip && (<Button className="w-full bg-vip text-vip-foreground hover:bg-vip/90" onClick={() => openPayment("7day")}>
                Unlock all VIP picks
              </Button>)}
          </div>)}

        {tab === "history" && <WinningHistory groups={historyGroups}/>}

        {tab === "pricing" && <Pricing onSubscribe={openPayment}/>}
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-8 pt-2 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TipKings. Bet responsibly. 18+</p>
        <Link to="/admin" className="mt-2 inline-block text-[11px] text-muted-foreground/60 hover:text-muted-foreground">
          Staff login
        </Link>
      </footer>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen}/>
      <PaymentModal open={payOpen} onOpenChange={setPayOpen} initialPlan={payPlan}/>
    </div>);
}
