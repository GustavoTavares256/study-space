import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth";
import { storage, storageKeys } from "../services/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { user } = await authService.getSession();
      if (!mounted) return;
      setUser(user);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (credentials) => {
    const { user, error } = await authService.signIn(credentials);
    if (user) setUser(user);
    return { user, error };
  };

  const signUp = async (data) => {
    const { user, error } = await authService.signUp(data);
    if (user) setUser(user);
    return { user, error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
