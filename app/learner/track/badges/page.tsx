"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { MOCK_TRAINEE_COURSES } from "@/lib/traineeCoursesMock";

const MOCK_EARNED_BADGES = [
  { id: "b-onboarding", name: "オンボーディング完了", at: "2025-12-01" },
  { id: "b-security", name: "セキュリティ基礎", at: "2026-02-20" },
];

export default function TrackLearnerBadgesPage() {
  const { earnedBadgeIds } = useLearnerProgress();
  const dynamicBadges = earnedBadgeIds.map((id) => {
    const m = /^badge-course-(\d+)$/.exec(id);
    const courseId = m ? parseInt(m[1], 10) : NaN;
    const title = Number.isFinite(courseId)
      ? MOCK_TRAINEE_COURSES.find((c) => c.id === courseId)?.title
      : undefined;
    return {
      id,
      name: title ? `修了: ${title}` : id.replace(/^badge-/, ""),
      at: "モック修了",
    };
  });

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">Track e-learning / バッジ</nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">バッジ</h1>
        <p className="mt-1 text-sm text-slate-600">
          修了やプログラム達成で付与されたバッジのモック一覧です。コース開始ページの「モック修了」で追加されます。
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...MOCK_EARNED_BADGES, ...dynamicBadges].map((b) => (
          <div
            key={b.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Award className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{b.name}</p>
              <p className="mt-1 text-xs text-slate-500">取得: {b.at}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href="/learner/track/courses" className="text-sm font-medium text-indigo-600 hover:underline">
        コース一覧へ
      </Link>
    </div>
  );
}
