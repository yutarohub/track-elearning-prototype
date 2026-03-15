"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  MOCK_COURSE_RATING_SUMMARIES,
  MOCK_COURSE_REVIEWS,
  type CourseRatingSummary,
  type CourseReview,
} from "@/lib/courseRatingsMock";
import { Star, Search, ChevronRight, X } from "lucide-react";

function StarDisplay({ value, max = 5, size = "sm" }: { value: number; max?: number; size?: "sm" | "md" }) {
  const full = Math.floor(value);
  const empty = max - full;
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} / ${max}`}>
      {Array.from({ length: full }, (_, i) => (
        <Star key={`f-${i}`} className={`${iconClass} fill-amber-400 text-amber-400`} />
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <Star key={`e-${i}`} className={`${iconClass} text-slate-200`} />
      ))}
      <span className="ml-1 text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}

function DistributionBar({ count, total, label }: { count: number; total: number; label: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs text-slate-600">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs text-slate-500">{count}</span>
    </div>
  );
}

export default function CourseRatingsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseRatingSummary | null>(null);

  const categories = useMemo(() => {
    const set = new Set(MOCK_COURSE_RATING_SUMMARIES.map((c) => c.category));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_COURSE_RATING_SUMMARIES;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.courseTitle.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") {
      list = list.filter((c) => c.category === categoryFilter);
    }
    return list;
  }, [search, categoryFilter]);

  const reviewsForSelected = useMemo(() => {
    if (!selectedCourse) return [];
    return MOCK_COURSE_REVIEWS.filter((r) => r.courseId === selectedCourse.courseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedCourse]);

  return (
    <AppLayout>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">コースレイティング</h1>
          <p className="mt-1 text-sm text-slate-500">
            各コースの評価・レビュー結果を確認できます
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="コース名・カテゴリで検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label="検索"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500">カテゴリ:</span>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  categoryFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                すべて
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    categoryFilter === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-4 py-3 font-semibold text-slate-700">コース名</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">カテゴリ</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">評価</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">レビュー数</th>
                  <th className="w-10 px-4 py-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr
                    key={course.courseId}
                    onClick={() => setSelectedCourse(course)}
                    className={`cursor-pointer border-b border-slate-50 transition hover:bg-indigo-50/50 ${
                      selectedCourse?.courseId === course.courseId ? "bg-indigo-50/80" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {course.courseTitle}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{course.category}</td>
                    <td className="px-4 py-3">
                      <StarDisplay value={course.averageRating} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {course.reviewCount} 件
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 詳細パネル（選択時） */}
        {selectedCourse && (
          <aside
            className="w-full max-w-md shrink-0 animate-[fade-in_0.2s_ease-out] rounded-xl border border-slate-200 bg-white shadow-lg"
            aria-label="コース評価詳細"
          >
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="font-semibold text-slate-900">{selectedCourse.courseTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{selectedCourse.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="閉じる"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <StarDisplay value={selectedCourse.averageRating} size="md" />
                <span className="text-slate-600">{selectedCourse.reviewCount} 件のレビュー</span>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">評価の内訳</p>
                <div className="space-y-2">
                  {([5, 4, 3, 2, 1] as const).map((star) => (
                    <DistributionBar
                      key={star}
                      label={`${star} つ星`}
                      count={selectedCourse.distribution[star]}
                      total={selectedCourse.reviewCount}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-medium text-slate-500">最近のレビュー</p>
                <ul className="space-y-4">
                  {reviewsForSelected.length === 0 ? (
                    <li className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center text-sm text-slate-500">
                      まだレビューはありません
                    </li>
                  ) : (
                    reviewsForSelected.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  )}
                </ul>
              </div>
            </div>
          </aside>
        )}
      </div>
    </AppLayout>
  );
}

function ReviewCard({ review }: { review: CourseReview }) {
  return (
    <li className="rounded-lg border border-slate-100 bg-slate-50/30 p-3">
      <div className="flex items-center justify-between">
        <StarDisplay value={review.rating} />
        <span className="text-xs text-slate-500">{review.createdAt}</span>
      </div>
      <p className="mt-1 text-xs font-medium text-slate-700">{review.userName}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.comment}</p>
      {review.helpfulCount != null && review.helpfulCount > 0 && (
        <p className="mt-2 text-xs text-slate-500">役に立った: {review.helpfulCount} 人</p>
      )}
    </li>
  );
}
