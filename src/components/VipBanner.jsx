import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";
import { plans, formatPrice } from "@/data/predictions";
export function VipBanner({ onClick }) {
    const { currency } = useCurrency();
    const monthly = plans.find((p) => p.id === "30day") ?? plans[2];
    return (<div className="flex flex-col items-start gap-3 rounded-2xl p-5 text-vip-foreground sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--gradient-vip)" }}>
      <div className="flex items-center gap-3">
        <Crown className="size-7 shrink-0"/>
        <div>
          <p className="font-bold leading-tight">Get VIP Membership for 1 Month</p>
          <p className="text-sm opacity-90">with as little as {formatPrice(monthly, currency)}</p>
        </div>
      </div>
      <Button onClick={onClick} className="bg-vip-foreground text-vip hover:bg-vip-foreground/90">
        Get VIP Now
      </Button>
    </div>);
}
