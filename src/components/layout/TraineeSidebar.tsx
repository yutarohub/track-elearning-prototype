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
} from "lucide-react";

const navItems: (
  | { label: string; href: string; icon: typeof Home }
  | {
      label: string;
      icon: typeof Award;
      children: { label: string; href: string }[];
    }
)[] = [
  { label: "ホーム", href: "/learner/home", icon: Home },
  {
    label: "マイスキル",
    icon: Award,
    children: [
      { label: "保有スキル一覧", href: "#" },
      { label: "スキルギャップ分析", href: "#" },
      { label: "スキルタイムライン", href: "#" },
    ],
  },
  {
    label: "スキル診断",
    icon: ClipboardList,
    children: [
      { label: "スキル調査", href: "#" },
      { label: "試験", href: "#" },
    ],
  },
  {
    label: "スキル習得",
    icon: BookOpen,
    children: [
      { label: "コース", href: "/learner/skills/courses" },
      { label: "学習パス", href: "#" },
      { label: "学習履歴", href: "#" },
    ],
  },
];

export function TraineeSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName = user?.email ? "岩崎 雄太郎" : "受講者";
  const initial = displayName.slice(0, 1);

  return (
    <aside
      className="fixed left-0 top-0 z-20 h-full w-64 bg-[#0f1629]"
      role="navigation"
      aria-label="受講者メニュー"
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white">
          T
        </div>
        <span className="font-semibold text-white">Track e-learning</span>
      </div>

      <nav className="space-y-1 px-3 py-4">
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
                    ? "bg-gradient-to-r from-indigo-600/80 to-violet-600/80 text-white"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white/90"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          }
          return (
            <div key={item.label}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-white/90"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-white/50" />
              </button>
              {item.children.length > 0 && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children.map((child) => {
                    const isChildActive = child.href !== "#" && pathname === child.href;
                    if (child.href === "#") {
                      return (
                        <span
                          key={child.label}
                          className="block rounded-lg px-2 py-1.5 text-xs text-white/50"
                        >
                          {child.label}
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`block rounded-lg px-2 py-1.5 text-xs transition ${
                          isChildActive
                            ? "font-medium text-indigo-300"
                            : "text-white/60 hover:text-white/90"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/[0.06] hover:text-white/90"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/80 text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{displayName}</p>
            <p className="text-[10px] text-white/50">プロフィール</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
        </button>
      </div>
    </aside>
  );
}
