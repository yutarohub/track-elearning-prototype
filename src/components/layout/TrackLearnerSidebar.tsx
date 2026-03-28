"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  History,
  Award,
  Bell,
  ArrowLeft,
} from "lucide-react";

const SKILL_HUB_HOME = "/learner/skill-hub/home";

const trackLinks: { label: string; href: string; icon: typeof BookOpen }[] = [
  { label: "コース一覧", href: "/learner/track/courses", icon: BookOpen },
  { label: "学習パス", href: "/learner/track/paths", icon: GraduationCap },
  { label: "学習歴", href: "/learner/track/history", icon: History },
  { label: "バッジ", href: "/learner/track/badges", icon: Award },
  { label: "通知 BOX", href: "/learner/track/notifications", icon: Bell },
];

export function TrackLearnerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName = user?.email ? "岩崎 雄太郎" : "受講者";
  const initial = displayName.slice(0, 1);

  return (
    <aside
      className="fixed left-0 top-0 z-20 h-full w-64 bg-[#0f1629]"
      role="navigation"
      aria-label="Track e-learning メニュー"
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white">
          T
        </div>
        <div className="min-w-0">
          <span className="block truncate font-semibold text-white">Track e-learning</span>
          <span className="text-[10px] text-white/45">コース・学習履歴</span>
        </div>
      </div>

      <nav className="space-y-1 px-3 py-4 pb-44">
        <Link
          href={SKILL_HUB_HOME}
          className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white/90 transition hover:bg-white/[0.08]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-cyan-400" />
          Skill Hub に戻る
        </Link>

        {trackLinks.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/learner/track/courses" && pathname.startsWith(`${href}/`));
          const coursesActive =
            href === "/learner/track/courses" &&
            (pathname === href || pathname.startsWith("/learner/track/courses/"));
          const isActive = href === "/learner/track/courses" ? coursesActive : active;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/80 to-violet-600/80 text-white"
                  : "text-white/70 hover:bg-white/[0.06] hover:text-white/90"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}

        <div className="pt-3">
          <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
            おすすめ
          </p>
          <Link
            href="/learner/track/recommendations"
            className={`block rounded-lg px-3 py-2 text-sm ${
              pathname.startsWith("/learner/track/recommendations")
                ? "font-medium text-indigo-300"
                : "text-white/60 hover:text-white/90"
            }`}
          >
            AI コースレコメンド
          </Link>
          <Link
            href="/learner/track/learning-path"
            className={`mt-0.5 block rounded-lg px-3 py-2 text-sm ${
              pathname.startsWith("/learner/track/learning-path")
                ? "font-medium text-indigo-300"
                : "text-white/60 hover:text-white/90"
            }`}
          >
            学習パス自動生成
          </Link>
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-white/[0.06] bg-[#0f1629] p-3">
        <button
          type="button"
          aria-label="プロフィール（開発中）"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/[0.06] hover:text-white/90"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/80 text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{displayName}</p>
            <p className="text-[10px] text-white/50">
              プロフィール<span className="text-inherit" aria-hidden>🚧</span>
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
        </button>
      </div>
    </aside>
  );
}
