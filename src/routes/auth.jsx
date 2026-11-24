import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export const Route = createFileRoute("/auth")({
    ssr: false,
    head: () => ({ meta: [{ title: "Admin Sign In — TipKings" }] }),
    component: AuthPage,
});
function AuthPage() {
    const navigate = useNavigate();
    const { session, loading } = useAuth();
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        if (!loading && session)
            navigate({ to: "/admin" });
    }, [loading, session, navigate]);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: `${window.location.origin}/admin` },
                });
                if (error)
                    throw error;
                toast.success("Account created. You can now sign in.");
                setMode("signin");
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error)
                    throw error;
                navigate({ to: "/admin" });
            }
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Authentication failed");
        }
        finally {
            setBusy(false);
        }
    };
    const google = async () => {
        const result = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: `${window.location.origin}/admin`,
        });
        if (result.error) {
            toast.error("Google sign-in failed");
            return;
        }
        if (result.redirected)
            return;
        navigate({ to: "/admin" });
    };
    return (<div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="size-6 text-primary"/>
          <span className="text-lg font-extrabold tracking-tight">TipKings</span>
        </Link>
        <h1 className="text-center text-lg font-semibold">
          {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
        </h1>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Manage predictions and winning history
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin"/>}
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border"/> or <span className="h-px flex-1 bg-border"/>
        </div>

        <Button variant="outline" className="w-full" onClick={google}>
          Continue with Google
        </Button>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>);
}
