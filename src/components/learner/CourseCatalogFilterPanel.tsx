"use client";

import type { Dispatch, SetStateAction } from "react";
import { ALL_TRAINEE_COURSE_TAGS } from "@/lib/traineeCoursesMock";
import {
  isFiltersDefault,
  type CatalogFilters,
} from "@/lib/traineeCourseCatalog";
import { Search, X, CalendarDays, Filter } from "lucide-react";

const DIFF_OPTIONS = ["初級", "中級", "上級"] as const;

export function CourseCatalogFilterPanel({
  filters,
  setFilters,
  onClearAll,
}: {
  filters: CatalogFilters;
  setFilters: Dispatch<SetStateAction<CatalogFilters>>;
  onClearAll: () => void;
}) {
  const hasActive = !isFiltersDefault(filters);

  function toggleTag(tag: string) {
    setFilters((f) => {
      const has = f.selectedTags.includes(tag);
      return {
        ...f,
        selectedTags: has ? f.selectedTags.filter((t) => t !== tag) : [...f.selectedTags, tag],
      };
    });
  }

  function toggleDifficulty(d: (typeof DIFF_OPTIONS)[number]) {
    setFilters((f) => {
      const has = f.difficulties.includes(d);
      const next = has ? f.difficulties.filter((x) => x !== d) : [...f.difficulties, d];
      return { ...f, difficulties: next as CatalogFilters["difficulties"] };
    });
  }

  return (
    <section
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"
      aria-label="検索とフィルター"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Filter className="h-4 w-4 text-indigo-600" />
          フィルター
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            hasActive
              ? "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
              : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
          }`}
          disabled={!hasActive}
        >
          <X className="h-3.5 w-3.5" />
          すべて解除 (Clear All)
        </button>
      </div>

      {/* 検索バー＋主要フィルター（常時表示・モーダルなし） */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="複数キーワード（スペース区切り・順不同）"
            value={filters.searchRaw}
            onChange={(e) => setFilters((f) => ({ ...f, searchRaw: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            aria-label="コース検索"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-sm">
            <input
              type="checkbox"
              checked={filters.delivery.on_demand}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  delivery: { ...f.delivery, on_demand: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            オンデマンド
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-sm">
            <input
              type="checkbox"
              checked={filters.delivery.live}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  delivery: { ...f.delivery, live: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            ライブ
          </label>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
            <input
              type="date"
              value={filters.liveDate}
              onChange={(e) => setFilters((f) => ({ ...f, liveDate: e.target.value }))}
              className="border-0 bg-transparent p-0 text-xs text-slate-800 focus:outline-none focus:ring-0"
              title="ライブ開催日で絞り込み"
              aria-label="ライブ開催日"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-600">タグ（複数選択・AND）</p>
        <div className="max-h-28 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/60 p-2">
          <div className="flex flex-wrap gap-1.5">
            {ALL_TRAINEE_COURSE_TAGS.map((tag) => {
              const on = filters.selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    on
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-2 text-xs font-medium text-slate-600">難易度（入門は初級に含む）</p>
          <div className="flex flex-wrap gap-2">
            {DIFF_OPTIONS.map((d) => {
              const on = filters.difficulties.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDifficulty(d)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    on ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-slate-600">価格</p>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={filters.priceFree}
                onChange={(e) => setFilters((f) => ({ ...f, priceFree: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              無料
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={filters.pricePaid}
                onChange={(e) => setFilters((f) => ({ ...f, pricePaid: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              有料
            </label>
          </div>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-2 text-xs font-medium text-slate-600">所要時間</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "short" as const, label: "〜3時間" },
                { id: "medium" as const, label: "3〜10時間" },
                { id: "long" as const, label: "10時間〜" },
              ] as const
            ).map(({ id, label }) => {
              const on = filters.durationBucket === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      durationBucket: f.durationBucket === id ? null : id,
                    }))
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    on ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
