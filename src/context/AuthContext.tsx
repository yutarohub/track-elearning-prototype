"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type User = {
  email: string;
  role: "admin" | "learner";
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  view: "admin" | "learner";
  setView: (view: "admin" | "learner") => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "track_user";
const DEMO_USER: User = { email: "demo@track.local", role: "admin" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [view, setViewState] = useState<"admin" | "learner">("admin");
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const setView = useCallback(
    (newView: "admin" | "learner") => {
      setViewState(newView);
      if (newView === "learner") router.push("/learner/workspace");
      else router.push("/admin/dashboard");
    },
    [router]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const ok =
        email === "yutaro.iwasaki@givery.co.jp" && password === "tracklms";
      if (ok) {
        const newUser: User = { email, role: "admin" };
        setUser(newUser);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        }
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (pathname === "/login") {
      setAuthChecked(true);
      return;
    }
    if (pathname == null) {
      setAuthChecked(true);
      return;
    }
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        if (parsed?.email && (parsed.role === "admin" || parsed.role === "learner")) {
          setUser(parsed);
          setAuthChecked(true);
          return;
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    const isAdminOrLearner =
      pathname.startsWith("/admin") || pathname.startsWith("/learner");
    if (isAdminOrLearner && process.env.NODE_ENV === "development") {
      setUser(DEMO_USER);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
      setAuthChecked(true);
      return;
    }

    router.push("/login");
    setAuthChecked(true);
  }, [pathname, router]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    view,
    setView,
  };

  if (!authChecked) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#0f1629] text-white"
        aria-live="polite"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white">
          T
        </div>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
