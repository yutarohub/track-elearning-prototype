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
/** Middleware と同期する Cookie 名（未設定なら /login へリダイレクト） */
export const AUTH_COOKIE = "track_session";

const COOKIE_MAX_AGE_DAYS = 7;

function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * COOKIE_MAX_AGE_DAYS}; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/** このプロトタイプで許可する固定認証情報（それ以外はログイン失敗） */
export const FIXED_LOGIN = {
  email: "yutaro.iwasaki@givery.co.jp",
  password: "tracklms",
} as const;

function isValidUser(u: unknown): u is User {
  if (!u || typeof u !== "object") return false;
  const o = u as Record<string, unknown>;
  return (
    o.email === FIXED_LOGIN.email &&
    (o.role === "admin" || o.role === "learner")
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [view, setViewState] = useState<"admin" | "learner">("admin");
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const setView = useCallback(
    (newView: "admin" | "learner") => {
      setViewState(newView);
      if (newView === "learner") router.push("/learner/home");
      else router.push("/admin/dashboard");
    },
    [router]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const ok =
        email === FIXED_LOGIN.email && password === FIXED_LOGIN.password;
      if (ok) {
        const newUser: User = { email: FIXED_LOGIN.email, role: "admin" };
        setUser(newUser);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          setAuthCookie();
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
      clearAuthCookie();
    }
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (pathname === "/login") {
      setAuthChecked(true);
      return;
    }
    // pathname が null のときは初期表示のためローディング扱いにするが、
    // Next が pathname を渡すまで null のままになる環境では「読み込み中」で止まるため、
    // null のときも authChecked を true にして先に進める。
    // Middleware が未ログイン時は /login にしか流さないため、表示されるのはログイン画面になる。
    if (pathname == null) {
      setAuthChecked(true);
      return;
    }
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (isValidUser(parsed)) {
          setUser(parsed);
          setAuthCookie(); // 復元時も Cookie を立てて Middleware を通過させる
          setAuthChecked(true);
          return;
        }
      } catch {
        // ignore
      }
      window.localStorage.removeItem(STORAGE_KEY);
    }

    // 未ログイン時は常にログインへ（開発時も自動ログインしない）
    router.replace("/login");
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
