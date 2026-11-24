import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
const OPTIONS = [
    { value: "NGN", label: "Nigeria ₦", flag: "🇳🇬" },
    { value: "KES", label: "Kenya KSh", flag: "🇰🇪" },
];
export function CurrencySwitch({ className }) {
    const { currency, setCurrency } = useCurrency();
    return (<div className={cn("inline-flex rounded-lg border border-border bg-card p-0.5", className)}>
      {OPTIONS.map((o) => (<button key={o.value} onClick={() => setCurrency(o.value)} className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors", currency === o.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent")} aria-pressed={currency === o.value}>
          <span>{o.flag}</span>
          <span className="hidden sm:inline">{o.label}</span>
          <span className="sm:hidden">{o.value}</span>
        </button>))}
    </div>);
}
