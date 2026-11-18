"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  SessionProvider,
  getSession as getNextAuthSession,
  signOut as nextAuthSignOut,
  useSession,
} from "next-auth/react";
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
} from "@/app/_types";

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthContextBridge({ children }: AuthProviderProps) {
  const { data, status } = useSession();
  const user = data?.user ? (data.user as AuthUser) : null;
  // signIn()/signOut() from next-auth already refresh the client session store,
  // so one getSession() call is enough to read the latest state.
  const refreshUser = useCallback(async () => {
    const latestSession = await getNextAuthSession();
    return latestSession?.user ? (latestSession.user as AuthUser) : null;
  }, []);
  const signOut = useCallback(async () => {
    await nextAuthSignOut({ redirect: false });
  }, []);
  const value = useMemo(
    () => ({ user, loading: status === "loading", refreshUser, signOut }),
    [user, status, refreshUser, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthContextBridge>{children}</AuthContextBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
