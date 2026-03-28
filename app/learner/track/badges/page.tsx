"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { getBadgeForCourseId } from "@/lib/mockData";
import { MOCK_TRAINEE_COURSES } from "@/lib/traineeCoursesMock";
import { BadgeCard } from "@/components/badges/BadgeCard";
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...MOCK_EARNED_BADGES, ...dynamicBadges].map((b) => (
          <BadgeCard key={b.id} accentColor={b.accentColor} className="aspect-square">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 px-2.5 pt-2.5 pb-1">
                <OpenBadgeImage imageSrc={b.imageSrc} size="grid" />
                <h2
                  className="line-clamp-2 w-full text-center text-xs font-bold leading-snug sm:text-sm"
                  style={{ color: b.accentColor }}
                >
                  {b.name}
                </h2>
              </div>
              <div className="flex shrink-0 justify-center border-t border-slate-100 px-2 py-1.5">
                <span className="inline-flex max-w-full items-center truncate rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 sm:text-[11px]">
                  <Award className="mr-0.5 h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                  取得 {b.at}
                </span>
              </div>
            </div>
          </BadgeCard>
        ))}
      </div>
      <Link href="/learner/track/courses" className="text-sm font-medium text-indigo-600 hover:underline">
        コース一覧へ
      </Link>
    </div>
  );
}
