"use client";

import { useAuth } from "@/context/AuthContext";
import {
  MOCK_IN_PROGRESS_COURSES,
  courseThumbnailUrl,
  type TraineeCourse,
} from "@/lib/traineeCoursesMock";
import { BarChart3, ChevronRight } from "lucide-react";

function CourseCardSmall({ course }: { course: TraineeCourse }) {
  const thumb = courseThumbnailUrl(course);
  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-32 w-full bg-slate-100">
        <img
          src={thumb}
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm">
          コース
        </span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {course.title}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">{course.difficulty} · {course.duration}</p>
        <p className="mt-2 text-[10px] text-slate-400">アクセス履歴なし</p>
      </div>
    </div>
  );
}

export default function LearnerHomePage() {
  const { user } = useAuth();
  const displayName = user?.email ? "岩崎 雄太郎" : "受講者";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          こんにちは、{displayName}さん
        </h1>
      </div>

      {/* プロフィールカード（プレースホルダー） */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{displayName}</h2>
            <p className="mt-0.5 text-sm text-slate-500">メール: {user?.email ?? "—"}</p>
            <p className="mt-2 text-xs text-slate-500">在籍中(正社員) · 実務経験: —</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="編集（開発中）"
          >
            <span className="text-slate-400" aria-hidden>🚧</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* スキルギャップ分析（プレースホルダー） */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">スキルギャップ分析</h2>
            <p className="text-sm text-slate-500">強みの分析と伸ばすべきスキルを確認できます</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          スキルギャップを確認する<span className="text-white" aria-hidden>🚧</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 保有スキル（プレースホルダー） */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">保有スキル（レベル順）</h2>
            <span className="text-xs text-slate-500">表示 10/148</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["チームマネジメント", "KPIの定義", "ワークフロー", "インターフェースデザイン"].map(
              (s) => (
                <span
                  key={s}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {s}
                </span>
              )
            )}
          </div>
          <p className="mt-2 text-xs text-slate-400">※UIのみ · データはモック</p>
        </div>

        {/* スキルタイムライン（プレースホルダー） */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">スキルタイムライン</h2>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>2026/03/15 — スキル調査入力（カスタマーサクセス）</li>
            <li>2026/03/01 — スキル調査入力（システムエンジニア）</li>
          </ul>
          <p className="mt-2 text-xs text-slate-400">※UIのみ · データはモック</p>
        </div>
      </div>

      {/* 受講中の講座 */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">受講中の講座</h2>
          <span className="text-xs text-slate-500">表示 {MOCK_IN_PROGRESS_COURSES.length}/{MOCK_IN_PROGRESS_COURSES.length}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          ※受講ステータスの更新には、最大で1日程度かかる場合があります。最終更新日時: 2026/03/15 06:00
        </p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {MOCK_IN_PROGRESS_COURSES.map((course) => (
            <CourseCardSmall key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
