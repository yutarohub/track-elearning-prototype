"use client";

import Link from "next/link";
import { MOCK_LEARNER_NOTIFICATIONS } from "@/lib/learnerSkillsMock";
import { Bell } from "lucide-react";

export default function TrackNotificationsPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link href="/learner/skill-hub/home" className="text-indigo-600 hover:text-indigo-800">
          Skill Hub
        </Link>
        <span className="mx-2">/</span>
        Track / 通知
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">通知 BOX</h1>
        <p className="mt-1 text-sm text-slate-600">申請結果・配信・リマインドのモック一覧です。</p>
      </header>
      <ul className="space-y-3">
        {MOCK_LEARNER_NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            className={`rounded-xl border p-4 shadow-sm ${
              n.unread ? "border-indigo-200 bg-indigo-50/40" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex gap-3">
              <Bell className={`mt-0.5 h-5 w-5 shrink-0 ${n.unread ? "text-indigo-600" : "text-slate-400"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-900">{n.title}</h2>
                  {n.unread && (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      未読
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                <p className="mt-2 text-xs text-slate-400">{n.at}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
