import { Lock, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
function ResultBadge({ result }) {
    if (result === "won")
        return (<span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
        <Check className="size-3"/> Won
      </span>);
    if (result === "lost")
        return (<span className="inline-flex items-center rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">
        Lost
      </span>);
    return (<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <Clock className="size-3"/> Pending
    </span>);
}
export function PredictionsTable({ predictions, onUnlock }) {
    return (<div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-[3rem_1fr_3.5rem_4rem] items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-[4rem_1fr_1fr_6rem_4rem_5rem] sm:px-4">
        <span>Time</span>
        <span className="hidden sm:block">Home</span>
        <span className="sm:hidden">Match</span>
        <span className="hidden sm:block">Away</span>
        <span>Tip</span>
        <span className="hidden sm:block">Odds</span>
        <span className="text-right sm:text-left">Result</span>
      </div>
      {predictions.map((p) => (<div key={p.id} className="grid grid-cols-[3rem_1fr_3.5rem_4rem] items-center gap-2 border-b border-border/60 px-3 py-3 text-sm last:border-0 sm:grid-cols-[4rem_1fr_1fr_6rem_4rem_5rem] sm:px-4">
          <span className="font-mono text-xs text-muted-foreground">{p.time}</span>
          <div className="min-w-0 sm:contents">
            <span className="block truncate font-medium">{p.home}</span>
            <span className="block truncate text-muted-foreground sm:text-foreground">
              <span className="text-muted-foreground sm:hidden">vs </span>
              {p.away}
            </span>
          </div>
          {p.vip ? (<button onClick={onUnlock} className="flex items-center gap-1 rounded-md bg-vip/15 px-2 py-1 text-xs font-semibold text-vip">
              <Lock className="size-3"/>
              <span className="select-none blur-[3px]">PICK</span>
            </button>) : (<span className="font-semibold text-primary">{p.tip}</span>)}
          <span className={cn("hidden font-mono text-xs sm:block", p.vip && "blur-[3px] select-none")}>
            {p.odds}
          </span>
          <span className="text-right sm:text-left">
            <ResultBadge result={p.result}/>
          </span>
        </div>))}
    </div>);
}
