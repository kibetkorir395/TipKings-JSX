import { Check, CalendarDays } from "lucide-react";
export function WinningHistory({ groups }) {
    return (<div className="space-y-6">
      {groups.map((group) => (<div key={group.date} className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays className="size-4 text-primary"/>
              {group.date}
            </div>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
              {group.games.length}/{group.games.length} Won
            </span>
          </div>
          {group.games.map((g) => (<div key={g.id} className="flex items-center gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-0">
              <span className="font-mono text-xs text-muted-foreground">{g.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {g.home} <span className="text-muted-foreground">vs</span> {g.away}
                </p>
                <p className="text-xs text-muted-foreground">
                  {g.tip} @ {g.odds} · FT {g.score}
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-xs font-semibold text-success">
                <Check className="size-3.5"/> Won
              </span>
            </div>))}
        </div>))}
    </div>);
}
