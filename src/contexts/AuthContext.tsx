import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const ADMIN_EMAIL = "Mohalaval4@gmail.com";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: "buyer" | "admin" | null;
  isAdmin: boolean;
  profile: { full_name: string; phone: string | null; avatar_url: string | null; city: string | null } | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"buyer" | "admin" | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);

  const resolveRole = (u: User | null): "buyer" | "admin" | null => {
    if (!u) return null;
    return u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "buyer";
  };

  const fetchUserData = async (userId: string) => {
    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name, phone, avatar_url, city")
      .eq("user_id", userId)
      .single();
    if (prof) setProfile(prof);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(resolveRole(session?.user ?? null));
      if (session?.user) setTimeout(() => fetchUserData(session.user.id), 0);
      else setProfile(null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(resolveRole(session?.user ?? null));
      if (session?.user) fetchUserData(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "buyer" });
      setRole(resolveRole(data.user));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
    window.dispatchEvent(new Event("user-signout"));
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAdmin, profile, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
