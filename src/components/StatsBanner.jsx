import { Users, TrendingUp, Headphones } from "lucide-react";
const stats = [
    { icon: Users, value: "10K+", label: "Happy Clients" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
    { icon: Headphones, value: "24/7", label: "Support" },
];
export function StatsBanner() {
    return (<div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4">
      {stats.map((s) => (<div key={s.label} className="flex flex-col items-center gap-1 text-center">
          <s.icon className="size-5 text-primary"/>
          <span className="text-xl font-extrabold sm:text-2xl">{s.value}</span>
          <span className="text-[11px] text-muted-foreground sm:text-xs">{s.label}</span>
        </div>))}
    </div>);
}
