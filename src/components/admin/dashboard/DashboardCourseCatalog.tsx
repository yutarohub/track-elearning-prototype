"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Course, CourseType, Difficulty } from "@/lib/mockData";
import { ProgressIndicator } from "@/components/dashboard/ProgressIndicator";

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    入門: "bg-sky-100 text-sky-800",
    初級: "bg-emerald-100 text-emerald-800",
    中級: "bg-amber-100 text-amber-800",
    上級: "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function TypeBadge({ type }: { type: CourseType }) {
  return (
    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
      {type}
    </span>
  );
}

const PER_PAGE = 10;

export interface DashboardCourseCatalogProps {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: "all" | CourseType;
  onTypeFilterChange: (v: "all" | CourseType) => void;
  difficultyFilter: "all" | Difficulty;
  onDifficultyFilterChange: (v: "all" | Difficulty) => void;
  page: number;
  onPageChange: (p: number) => void;
  filtered: Course[];
  paginated: Course[];
  totalPages: number;
  onRowClick: (course: Course) => void;
}

export function DashboardCourseCatalog({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  page,
  onPageChange,
  filtered,
  paginated,
  totalPages,
  onRowClick,
}: DashboardCourseCatalogProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">公開中コース一覧</h2>
        <p className="mt-1 text-sm text-slate-500">
          行をクリックすると詳細パネルが開きます。ここはカタログ運用・配信判断のための詳細レイヤです。
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="検索"
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="コース名や種類で検索"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">種類:</span>
            {(["all", "コース", "学習パス"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onTypeFilterChange(t === "all" ? "all" : t);
                  onPageChange(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  typeFilter === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t === "all" ? "すべて" : t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">難易度:</span>
            {(["all", "入門", "初級", "中級", "上級"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  onDifficultyFilterChange(d === "all" ? "all" : d);
                  onPageChange(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  difficultyFilter === d ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {d === "all" ? "すべて" : d}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">受講者</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">種類</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">難易度</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">進捗</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((course) => (
                  <tr
                    key={course.id}
                    onClick={() => onRowClick(course)}
                    className="cursor-pointer border-b border-slate-50 transition hover:bg-indigo-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{course.title}</td>
                    <td className="px-4 py-3 text-slate-600">{course.learners}</td>
                    <td className="px-4 py-3">
                      <TypeBadge type={course.type} />
                    </td>
                    <td className="px-4 py-3">
                      <DifficultyBadge difficulty={course.difficulty} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{course.duration}</td>
                    <td className="px-4 py-3">
                      <ProgressIndicator completed={course.progress.completed} total={course.progress.total} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">
              {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                aria-label="前のページ"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-slate-700">
                ページ {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                aria-label="次のページ"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
