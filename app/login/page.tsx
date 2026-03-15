"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      router.push("/admin/dashboard");
    } else {
      setError("IDまたはパスワードが正しくありません。");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f1629]">
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-20 top-32 h-2 w-2 rounded-full bg-white/60" />
      <div className="absolute bottom-40 left-1/3 h-1.5 w-1.5 rounded-full bg-indigo-300/80" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-xl backdrop-blur-xl">
          <h1 className="text-center text-2xl font-bold text-white">
            Track e-learning
          </h1>
          <p className="mt-1 text-center text-sm text-white/70">
            eラーニング・集合研修用 統合ダッシュボード
          </p>

          <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-white/80">
            管理者ログイン
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
              >
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1 block text-xs font-medium text-white/80"
              >
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder-white/40 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  placeholder="メールアドレスを入力"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="mb-1 block text-xs font-medium text-white/80"
              >
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder-white/40 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  placeholder="パスワードを入力"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              aria-label={loading ? "ログイン処理中" : "ログイン"}
              aria-busy={loading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-medium text-white shadow-lg transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ログイン中...
                </span>
              ) : (
                "ログイン"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
