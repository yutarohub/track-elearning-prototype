"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { getBadgeForCourseId } from "@/lib/mockData";
import { MOCK_TRAINEE_COURSES } from "@/lib/traineeCoursesMock";
import { OpenBadgeImage } from "@/components/badges/OpenBadgeImage";

type EarnedRow = {
  id: string;
  name: string;
  at: string;
  imageSrc?: string;
  accentColor: string;
};

const MOCK_EARNED_BADGES: EarnedRow[] = [
  {
    id: "b-onboarding",
    name: "オンボーディング完了",
    at: "2025-12-01",
    imageSrc: "/badges/badge-1-chatgpt-master.png",
    accentColor: "#6366f1",
  },
  {
    id: "b-security",
    name: "セキュリティ基礎",
    at: "2026-02-20",
    imageSrc: "/badges/badge-3-data-science-intro.png",
    accentColor: "#0ea5e9",
  },
];

export default function TrackLearnerBadgesPage() {
  const { earnedBadgeIds } = useLearnerProgress();
  const dynamicBadges: EarnedRow[] = earnedBadgeIds.map((id) => {
    const m = /^badge-course-(\d+)$/.exec(id);
    const courseId = m ? parseInt(m[1], 10) : NaN;
    const title = Number.isFinite(courseId)
      ? MOCK_TRAINEE_COURSES.find((c) => c.id === courseId)?.title
      : undefined;
    const badge = Number.isFinite(courseId) ? getBadgeForCourseId(courseId) : undefined;
    return {
      id,
      name: title ? `修了: ${title}` : id.replace(/^badge-/, ""),
      at: "モック修了",
      imageSrc: badge?.imageSrc,
      accentColor: badge?.color ?? "#64748b",
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
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[...MOCK_EARNED_BADGES, ...dynamicBadges].map((b) => (
          <div
            key={b.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-lg"
          >
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${b.accentColor}, ${b.accentColor}99)` }}
            />
            <div className="flex flex-col items-center border-b border-slate-100 bg-gradient-to-b from-slate-50/90 to-white px-5 pb-5 pt-6">
              <OpenBadgeImage imageSrc={b.imageSrc} size="card" />
              <h2
                className="mt-4 text-center text-lg font-bold tracking-tight"
                style={{ color: b.accentColor }}
              >
                {b.name}
              </h2>
            </div>
            <div className="flex items-center justify-center gap-2 px-5 py-4">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                <Award className="mr-1 h-3 w-3" />
                取得 {b.at}
              </span>
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
