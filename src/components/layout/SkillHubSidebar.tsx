"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  ChevronDown,
  ChevronRight,
  Award,
  ClipboardList,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const TRACK_COURSES_HREF = "/learner/track/courses";

const navItems: (
  | { label: string; href: string; icon: typeof Home }
  | {
      label: string;
      icon: typeof Award;
      children: { label: string; href: string }[];
    }
)[] = [
  { label: "ホーム", href: "/learner/skill-hub/home", icon: Home },
  {
    label: "マイスキル",
    icon: Award,
    children: [
      { label: "保有スキル一覧", href: "/learner/skill-hub/owned" },
      { label: "スキルギャップ分析", href: "/learner/skill-hub/gap" },
      { label: "スキルタイムライン", href: "/learner/skill-hub/timeline" },
    ],
  },
  {
    label: "スキル診断",
    icon: ClipboardList,
    children: [
      { label: "スキル調査", href: "/learner/skill-hub/diagnostics/survey" },
      { label: "試験", href: "/learner/skill-hub/diagnostics/exam" },
    ],
  },
];

export function SkillHubSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName = user?.email ? "岩崎 雄太郎" : "受講者";
  const initial = displayName.slice(0, 1);

  return (
    <aside
      className="fixed left-0 top-0 z-20 h-full w-64 border-r border-white/[0.08] bg-[#0c1222]"
      role="navigation"
      aria-label="Skill Hub メニュー"
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
          S
        </div>
        <div className="min-w-0">
          <span className="block truncate font-semibold text-white">Skill Hub</span>
          <span className="text-[10px] text-white/45">従業員向けスキル</span>
        </div>
      </div>

      <nav className="space-y-1 px-3 py-4 pb-44">
        {navItems.map((item) => {
          const Icon = item.icon;
          if ("href" in item) {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white/90"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          }
          const childActive = item.children.some(
            (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
          );
          return (
            <div key={item.label}>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  childActive ? "text-white" : "text-white/70 hover:bg-white/[0.06] hover:text-white/90"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-white/50" />
              </button>
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                  return (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`block rounded-lg px-2 py-1.5 text-xs transition ${
                        isChildActive
                          ? "font-medium text-cyan-300"
                          : "text-white/60 hover:text-white/90"
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-3">
          <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
            スキル習得
          </p>
          <Link
            href={TRACK_COURSES_HREF}
            className="flex items-center gap-3 rounded-lg bg-white/[0.08] px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/[0.12]"
          >
            <BookOpen className="h-5 w-5 shrink-0 text-cyan-300" />
            <span className="flex-1">Track e-learning で学ぶ</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
          </Link>
          <p className="mt-1.5 px-3 text-[10px] leading-snug text-white/40">
            同じアカウントのままコース一覧へ移動します
          </p>
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-white/[0.06] bg-[#0c1222] p-3">
        <button
          type="button"
          aria-label="プロフィール（開発中）"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/[0.06] hover:text-white/90"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-600/70 text-sm font-bold text-white">
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
