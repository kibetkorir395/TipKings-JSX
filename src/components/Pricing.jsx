import { Check, Star, Quote } from "lucide-react";
import { plans, testimonials, formatPrice } from "@/data/predictions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";
export function Pricing({ onSubscribe }) {
    const { currency } = useCurrency();
    return (<div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (<div key={plan.id} className={cn("relative flex flex-col rounded-2xl border bg-card p-5", plan.popular
                ? "border-vip shadow-[var(--shadow-vip)]"
                : "border-border")}>
            {plan.popular && (<span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-vip px-3 py-1 text-xs font-bold text-vip-foreground">
                <Star className="size-3 fill-current"/> Most Popular
              </span>)}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className="text-xs text-muted-foreground">{plan.period}</p>
            <p className="mt-3 text-2xl font-extrabold">{formatPrice(plan, currency)}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {plan.features.map((f) => (<li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary"/>
                  <span className="text-muted-foreground">{f}</span>
                </li>))}
            </ul>
            <Button onClick={() => onSubscribe(plan.id)} className={cn("mt-5 w-full", plan.popular && "bg-vip text-vip-foreground hover:bg-vip/90")}>
              Subscribe
            </Button>
          </div>))}
      </div>

      <div>
        <h3 className="mb-4 text-center text-xl font-bold">What our clients say</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (<div key={t.name} className="rounded-xl border border-border bg-card p-5">
              <Quote className="size-5 text-primary"/>
              <p className="mt-2 text-sm text-muted-foreground">"{t.text}"</p>
              <p className="mt-3 text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>))}
        </div>
      </div>
    </div>);
}
