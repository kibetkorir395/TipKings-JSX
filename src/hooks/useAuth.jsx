import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const AuthContext = createContext({
    session: null,
    isAdmin: false,
    loading: true,
    signOut: async () => { },
});
async function checkAdmin(userId) {
    const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
    return !!data;
}
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            if (newSession?.user) {
                setTimeout(() => {
                    checkAdmin(newSession.user.id).then(setIsAdmin);
                }, 0);
            }
            else {
                setIsAdmin(false);
            }
        });
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            if (data.session?.user) {
                checkAdmin(data.session.user.id).then((v) => {
                    setIsAdmin(v);
                    setLoading(false);
                });
            }
            else {
                setLoading(false);
            }
        });
        return () => sub.subscription.unsubscribe();
    }, []);
    const signOut = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false);
    };
    return (<AuthContext.Provider value={{ session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);
