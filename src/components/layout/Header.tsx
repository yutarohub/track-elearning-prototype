"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  ChevronDown,
  User,
  LogOut,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function headerDisplayName(view: "admin" | "learner", email: string | undefined) {
  const local = email?.split("@")[0];
  if (view === "learner") {
    return local === "yutaro.iwasaki" ? "岩崎 雄太郎" : local ?? "受講者";
  }
  return "Track 管理";
}

function learnerProductLabel(pathname: string | null): string | null {
  if (!pathname?.startsWith("/learner")) return null;
  if (pathname.startsWith("/learner/skill-hub")) return "Skill Hub";
  if (pathname.startsWith("/learner/track")) return "Track e-learning";
  return null;
}

export function Header() {
  const { view, setView, user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const productLabel = view === "learner" ? learnerProductLabel(pathname) : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="fixed left-64 right-0 top-0 z-10 h-16 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl"
      role="banner"
    >
      <div className="flex h-full items-center justify-between gap-4 px-6">
        <div className="min-w-0 flex-1">
          {productLabel && (
            <p className="truncate text-xs font-medium text-slate-500">
              <span className="text-slate-800">{productLabel}</span>
              <span className="text-slate-400"> · 同一アカウントで行き来できます</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {view === "learner" ? (
            <Link
              href="/learner/track/notifications"
              aria-label="通知一覧へ"
              className="relative flex items-center gap-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="通知（管理者ビューは準備中）"
              className="relative flex items-center gap-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell className="h-5 w-5" />
              <span className="text-slate-600" aria-hidden>
                🚧
              </span>
            </button>
          )}
          <button
            type="button"
            aria-label="設定（開発中）"
            className="flex items-center gap-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings className="h-5 w-5" />
            <span className="text-slate-600" aria-hidden>🚧</span>
          </button>
          <div className="ml-2 h-6 w-px bg-slate-200" />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-label="アカウントメニューを開く"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                dropdownOpen
                  ? "border-indigo-300 bg-indigo-50/80"
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                {user?.email?.slice(0, 2).toUpperCase() ?? "YU"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {headerDisplayName(view, user?.email)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  {view === "admin" ? "管理者ビュー" : "受講者ビュー"}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 w-72 rounded-b-xl border border-t-0 border-slate-200 bg-white py-2 shadow-lg"
                role="menu"
              >
                <div className="border-b border-slate-100 px-3 pb-2">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    役割
                  </p>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={view === "admin"}
                      onClick={() => {
                        setView("admin");
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                        view === "admin"
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                          view === "admin"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300"
                        }`}
                      >
                        {view === "admin" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      管理者
                    </button>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={view === "learner"}
                      onClick={() => {
                        setView("learner");
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                        view === "learner"
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                          view === "learner"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300"
                        }`}
                      >
                        {view === "learner" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      受講者
                    </button>
                  </div>
                </div>

                <div className="px-3 pt-2">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    設定
                  </p>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      アカウント管理
                      <ExternalLink className="ml-auto h-3.5 w-3.5 text-slate-400" />
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      アプリケーション設定
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Wrench className="h-4 w-4 text-slate-400" />
                      受験環境を確認する
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4 text-slate-400" />
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
