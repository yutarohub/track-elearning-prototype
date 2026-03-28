"use client";

import Link from "next/link";
import { MOCK_SKILL_GAPS } from "@/lib/learnerSkillsMock";
import { BarChart3, ChevronRight } from "lucide-react";

export default function SkillHubGapPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500" aria-label="パンくず">
        マイスキル / スキルギャップ分析
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">スキルギャップ分析</h1>
        <p className="mt-1 text-sm text-slate-600">
          職種モデルとの差分をモック表示しています。詳細からレコメンド・コース一覧連動へ進めます。
        </p>
      </header>
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-indigo-950">
        <div className="flex items-start gap-2">
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            ギャップに紐づくコースだけを見る:{" "}
            <Link
              href="/learner/track/courses?source=from_gap"
              className="font-semibold underline-offset-2 hover:underline"
            >
              Track のコース一覧（ギャップ連動フィルタ）
            </Link>
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_SKILL_GAPS.map((g) => (
          <div
            key={g.code}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-slate-900">{g.skillName}</h2>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  g.priority === "高"
                    ? "bg-rose-100 text-rose-900"
                    : g.priority === "中"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                優先度 {g.priority}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{g.summary}</p>
            <p className="mt-3 text-xs text-slate-500">
              目標 Lv.{g.requiredLevel} / 現在 Lv.{g.currentLevel}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {g.relatedTags.map((t) => (
                <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                  {t}
                </span>
              ))}
            </div>
            <Link
              href={`/learner/skill-hub/gap/${g.code}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              詳細を見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
