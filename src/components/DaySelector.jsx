import { DAYS } from "@/lib/predictions-api";
import { cn } from "@/lib/utils";
export function DaySelector({ active, onChange }) {
    return (<div className="flex gap-1.5 overflow-x-auto pb-1">
      {DAYS.map((day) => (<button key={day} onClick={() => onChange(day)} className={cn("flex-1 min-w-[52px] rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors", active === day
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                : "bg-card text-muted-foreground hover:bg-accent")}>
          {day}
        </button>))}
    </div>);
}
