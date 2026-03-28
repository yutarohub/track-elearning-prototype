"use client";

import Link from "next/link";
import { MOCK_SKILL_TIMELINE } from "@/lib/learnerSkillsMock";
import { Clock } from "lucide-react";

export default function SkillHubTimelinePage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">マイスキル / スキルタイムライン</nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">スキルタイムライン</h1>
        <p className="mt-1 text-sm text-slate-600">調査・試験などスキル関連イベントのモックです。</p>
      </header>
      <ol className="relative space-y-6 border-l border-slate-200 pl-6">
        {MOCK_SKILL_TIMELINE.map((t) => (
          <li key={t.id} className="relative">
            <span className="absolute -left-[29px] flex h-8 w-8 items-center justify-center rounded-full bg-white ring-2 ring-indigo-100">
              <Clock className="h-4 w-4 text-indigo-600" />
            </span>
            <p className="text-sm font-medium text-slate-900">{t.label}</p>
            <p className="text-xs text-slate-500">{t.date}</p>
            <p className="mt-1 text-sm text-slate-600">{t.detail}</p>
          </li>
        ))}
      </ol>
      <Link href="/learner/track/history" className="text-sm font-medium text-indigo-600 hover:underline">
        Track の学習歴へ
      </Link>
    </div>
  );
}
