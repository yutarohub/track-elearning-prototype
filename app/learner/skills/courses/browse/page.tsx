"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MOCK_TRAINEE_COURSES } from "@/lib/traineeCoursesMock";
import type { TraineeCourse } from "@/lib/traineeCoursesMock";
import {
  DEFAULT_CATALOG_FILTERS,
  applyBrowseView,
  browseViewTitle,
  filterCourses,
  tokenizeSearch,
  type CatalogBrowseView,
  type CatalogFilters,
} from "@/lib/traineeCourseCatalog";
import { CourseCatalogFilterPanel } from "@/components/learner/CourseCatalogFilterPanel";
import { SkillCourseCard } from "@/components/learner/SkillCourseCard";
import { useSkillCourseFavorites } from "@/components/learner/useSkillCourseFavorites";

const VALID_VIEWS: CatalogBrowseView[] = [
  "recommended",
  "upcoming-live",
  "new",
  "popular",
  "category",
];

function parseView(raw: string | null): CatalogBrowseView {
  if (raw && VALID_VIEWS.includes(raw as CatalogBrowseView)) {
    return raw as CatalogBrowseView;
  }
  return "popular";
}

function BrowseCoursesContent() {
  const searchParams = useSearchParams();
  const view = parseView(searchParams.get("view"));
  const categoryParam = searchParams.get("category");
  const category =
    categoryParam && view === "category" ? decodeURIComponent(categoryParam) : null;

  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_CATALOG_FILTERS);
  const [toast, setToast] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useSkillCourseFavorites();

  const searchTokens = useMemo(() => tokenizeSearch(filters.searchRaw), [filters.searchRaw]);
  const filtered = useMemo(() => filterCourses(MOCK_TRAINEE_COURSES, filters), [filters]);
  const list = useMemo(
    () => applyBrowseView(filtered, view, category),
    [filtered, view, category],
  );

  const title = browseViewTitle(view, category);

  function clearAll() {
    setFilters(DEFAULT_CATALOG_FILTERS);
  }

  function handlePrimaryAction(course: TraineeCourse) {
    setToast(
      course.delivery === "live"
        ? `「${course.title}」の受講申込フローは準備中です（モック）`
        : `「${course.title}」の学習を開始します（モック）`,
    );
    setTimeout(() => setToast(null), 3200);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/learner/skills/courses"
            className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4" />
            コース一覧に戻る
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">全件表示</span>
        </nav>

        <header>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            フィルターは即時反映されます。条件を変えて目的のコースを探せます。
          </p>
        </header>

        <CourseCatalogFilterPanel filters={filters} setFilters={setFilters} onClearAll={clearAll} />

        <section aria-label="コース一覧">
          {list.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-600">
              該当するコースがありません。フィルターを調整してください。
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((course) => (
                <SkillCourseCard
                  key={course.id}
                  course={course}
                  searchTokens={searchTokens}
                  favorite={favoriteIds.has(course.id)}
                  onToggleFavorite={() => toggleFavorite(course.id)}
                  onPrimaryAction={handlePrimaryAction}
                />
              ))}
            </div>
          )}
        </section>

        {toast && (
          <div
            className="fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-lg bg-slate-900 px-5 py-3 text-center text-sm text-white shadow-lg"
            role="status"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LearnerSkillsCoursesBrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
          読み込み中…
        </div>
      }
    >
      <BrowseCoursesContent />
    </Suspense>
  );
}
