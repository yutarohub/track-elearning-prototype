"use client";

import Link from "next/link";
import { MOCK_LEARNING_HISTORY } from "@/lib/learnerSkillsMock";
import { History } from "lucide-react";
import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { MOCK_TRAINEE_COURSES } from "@/lib/traineeCoursesMock";

export default function TrackHistoryPage() {
  const { completedCourseIds } = useLearnerProgress();

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">Track e-learning / 学習歴</nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">学習歴</h1>
        <p className="mt-1 text-sm text-slate-600">修了・診断の記録モックです。</p>
      </header>
      {completedCourseIds.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-950">
          <p className="font-medium">モックで完了したコース</p>
          <ul className="mt-2 list-inside list-disc">
            {completedCourseIds.map((id) => {
              const c = MOCK_TRAINEE_COURSES.find((x) => x.id === id);
              return <li key={id}>{c?.title ?? `ID ${id}`}</li>;
            })}
          </ul>
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            <h2 className="font-semibold text-slate-900">最近の活動</h2>
          </div>
        </div>
        <ul className="divide-y divide-slate-100">
          {MOCK_LEARNING_HISTORY.map((h) => (
            <li key={h.id} className="px-6 py-4">
              <p className="font-medium text-slate-900">{h.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {h.type} · {h.completedAt}
                {h.score ? ` · ${h.score}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-slate-500">
        スキル調査の時系列は{" "}
        <Link href="/learner/skill-hub/timeline" className="text-indigo-600 hover:underline">
          Skill Hub のスキルタイムライン
        </Link>
        でも確認できます。
      </p>
    </div>
  );
}
