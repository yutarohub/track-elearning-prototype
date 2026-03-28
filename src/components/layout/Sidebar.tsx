"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  Users,
  FileText,
  Library,
  Sparkles,
  Award,
  ChevronDown,
  HeadphonesIcon,
  Star,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLearning = [
  { label: "ダッシュボード", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "eラーニング公開管理", href: "/admin/publish", icon: Send },
  { label: "申請管理", href: "#", icon: FileText },
];

const navTenant = [
  { label: "メンバー", href: "#", icon: Users },
  { label: "契約", href: "#", icon: FileText },
  { label: "ライブラリ", href: "/admin/library", icon: Library },
  { label: "バッジ管理", href: "/admin/badges", icon: Award },
  { label: "コースレイティング", href: "/admin/course-ratings", icon: Star },
  { label: "AIアシスタント", href: "#", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setView } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 z-20 h-full w-64 bg-[#0f1629]"
      role="navigation"
      aria-label="メインメニュー"
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white">
          T
        </div>
        <span className="font-semibold text-white">Track e-learning</span>
      </div>

      <div className="border-b border-white/[0.06] px-3 py-3">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
          Workspace
        </p>
        <button
          type="button"
          aria-label='ワークスペース「Track e-learning」を選択（開発中）'
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/[0.06]"
        >
          <span>Track e-learning<span className="text-inherit" aria-hidden> 🚧</span></span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </button>
      </div>

      <nav className="space-y-1 px-3 py-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/50">
          学習管理
        </p>
        {navLearning.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}{item.href === "#" ? <span className="text-inherit" aria-hidden> 🚧</span> : null}</span>
            </>
          );
          const className = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
            isActive
              ? "bg-gradient-to-r from-indigo-600/80 to-violet-600/80 text-white"
              : "text-white/50 hover:bg-white/[0.06] hover:text-white/90"
          }`;
          if (item.href === "#") {
            return (
              <button
                key={item.label}
                type="button"
                className={`w-full ${className}`}
              >
                {content}
              </button>
            );
          }
          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>

      <nav className="space-y-1 px-3 py-4 pb-44">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/50">
          テナント全体管理
        </p>
        {navTenant.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}{item.href === "#" ? <span className="text-inherit" aria-hidden> 🚧</span> : null}</span>
            </>
          );
          const className = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
            isActive
              ? "bg-gradient-to-r from-indigo-600/80 to-violet-600/80 text-white"
              : "text-white/50 hover:bg-white/[0.06] hover:text-white/90"
          }`;
          if (item.href === "#") {
            return (
              <button
                key={item.label}
                type="button"
                className={`w-full ${className}`}
              >
                {content}
              </button>
            );
          }
          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-white/[0.06] bg-[#0f1629] p-3">
        <button
          type="button"
          onClick={() => setView("learner")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0f1629]"
        >
          <GraduationCap className="h-5 w-5 shrink-0" aria-hidden />
          受講者ビューへ（学習する）
        </button>
        <p className="px-1 text-center text-[10px] leading-snug text-white/45">
          Skill Hub と同じアカウントのまま切り替え（プロトタイプ）
        </p>
        <button
          type="button"
          aria-label="サポートへ問い合わせ（開発中）"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white/90"
        >
          <HeadphonesIcon className="h-5 w-5" />
          サポートへ問い合わせ<span className="text-inherit" aria-hidden> 🚧</span>
        </button>
      </div>
    </aside>
  );
}
