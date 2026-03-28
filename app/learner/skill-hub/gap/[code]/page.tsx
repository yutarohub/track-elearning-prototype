"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_SKILL_GAPS, MOCK_GAP_RECOMMENDATIONS } from "@/lib/learnerSkillsMock";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function SkillHubGapDetailPage() {
  const params = useParams();
  const code = typeof params.code === "string" ? params.code : "";
  const gap = MOCK_SKILL_GAPS.find((g) => g.code === code);
  const recs = MOCK_GAP_RECOMMENDATIONS.filter((r) => r.gapCode === code);

  if (!gap) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">該当するギャップが見つかりません。</p>
        <Link href="/learner/skill-hub/gap" className="text-indigo-600 hover:underline">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/learner/skill-hub/gap"
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" />
        ギャップ一覧に戻る
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{gap.skillName}</h1>
        <p className="mt-1 text-sm text-slate-600">{gap.summary}</p>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">ギャップ内訳（モック）</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">現在レベル</dt>
            <dd className="font-medium text-slate-900">Lv.{gap.currentLevel}</dd>
          </div>
          <div>
            <dt className="text-slate-500">必須レベル</dt>
            <dd className="font-medium text-slate-900">Lv.{gap.requiredLevel}</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold text-violet-950">推奨アクション</h2>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-violet-950">
          {recs.length === 0 ? (
            <li>このギャップ用のレコメンドは別画面で確認してください。</li>
          ) : (
            recs.map((r) => (
              <li key={r.id}>
                <span className="font-medium">{r.title}</span> — {r.reason}
              </li>
            ))
          )}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/learner/track/recommendations"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            AIコースレコメンドへ
          </Link>
          <Link
            href="/learner/track/courses?source=from_gap"
            className="rounded-lg border border-violet-300 bg-white px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100/50"
          >
            Track コース一覧（ギャップ連動）
          </Link>
        </div>
      </div>
    </div>
  );
}
