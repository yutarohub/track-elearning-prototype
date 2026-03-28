"use client";

import Link from "next/link";
import { MOCK_GAP_RECOMMENDATIONS, MOCK_SKILL_GAPS } from "@/lib/learnerSkillsMock";
import { Sparkles } from "lucide-react";

export default function TrackRecommendationsPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">Track e-learning / AIコースレコメンド</nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">AI コースレコメンド</h1>
        <p className="mt-1 text-sm text-slate-600">
          ギャップ分析と連動した提案UIのモックです。実際の推論APIは接続していません。
        </p>
      </header>
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">あなたへの提案</h2>
        </div>
        <ul className="mt-4 space-y-4">
          {MOCK_GAP_RECOMMENDATIONS.map((r) => {
            const gap = MOCK_SKILL_GAPS.find((g) => g.code === r.gapCode);
            return (
              <li
                key={r.id}
                className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{r.title}</p>
                <p className="mt-1 text-sm text-slate-600">{r.reason}</p>
                {gap && (
                  <p className="mt-2 text-xs text-slate-500">関連ギャップ: {gap.skillName}</p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learner/track/learning-path"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            学習パスを自動生成
          </Link>
          <Link
            href="/learner/track/courses?source=from_recommend"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            おすすめのみコース一覧へ
          </Link>
          <Link
            href="/learner/skill-hub/gap"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Skill Hub のギャップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
