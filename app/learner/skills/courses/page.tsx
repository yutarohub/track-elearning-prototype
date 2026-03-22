"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_TRAINEE_COURSES } from "@/lib/traineeCoursesMock";
import type { TraineeCourse } from "@/lib/traineeCoursesMock";
import {
  DEFAULT_CATALOG_FILTERS,
  filterCourses,
  isFiltersDefault,
  sortByLiveSoon,
  sortByNewest,
  sortByPopular,
  tokenizeSearch,
  type CatalogFilters,
} from "@/lib/traineeCourseCatalog";
import { SkillCourseCard } from "@/components/learner/SkillCourseCard";
import { CourseCatalogFilterPanel } from "@/components/learner/CourseCatalogFilterPanel";
import { useSkillCourseFavorites } from "@/components/learner/useSkillCourseFavorites";
import { ChevronRight } from "lucide-react";

const SECTION_LIMIT = 8;

/** コース数が多いカテゴリから上位（DSS準拠の探索補助） */
function topCategoriesByVolume(courses: TraineeCourse[], limit: number): string[] {
  const counts = new Map<string, number>();
  courses.forEach((c) => counts.set(c.category, (counts.get(c.category) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

function CatalogSectionHeader({
  title,
  hint,
  viewAllHref,
}: {
  title: string;
  hint?: string;
  viewAllHref: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      </div>
      <Link
        href={viewAllHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        View All
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function HorizontalCourseRow({
  courses,
  searchTokens,
  favoriteIds,
  onToggleFavorite,
  onPrimary,
}: {
  courses: TraineeCourse[];
  searchTokens: string[];
  favoriteIds: Set<number>;
  onToggleFavorite: (id: number) => void;
  onPrimary: (c: TraineeCourse) => void;
}) {
  return (
    <div className="-mx-1 flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-gutter:stable]">
      {courses.map((course) => (
        <div key={course.id} className="w-72 shrink-0 px-1">
          <SkillCourseCard
            course={course}
            searchTokens={searchTokens}
            favorite={favoriteIds.has(course.id)}
            onToggleFavorite={() => onToggleFavorite(course.id)}
            onPrimaryAction={onPrimary}
          />
        </div>
      ))}
    </div>
  );
}

export default function LearnerSkillsCoursesPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_CATALOG_FILTERS);
  const [toast, setToast] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useSkillCourseFavorites();

  const searchTokens = useMemo(() => tokenizeSearch(filters.searchRaw), [filters.searchRaw]);
  const filtered = useMemo(() => filterCourses(MOCK_TRAINEE_COURSES, filters), [filters]);
  const showDiscoverySections = isFiltersDefault(filters);

  const categoryRank = useMemo(() => topCategoriesByVolume(MOCK_TRAINEE_COURSES, 3), []);

  const recommended = useMemo(
    () => filtered.filter((c) => c.recommended).slice(0, SECTION_LIMIT),
    [filtered],
  );
  const upcomingLive = useMemo(
    () =>
      [...filtered]
        .filter((c) => c.delivery === "live")
        .sort(sortByLiveSoon)
        .slice(0, SECTION_LIMIT),
    [filtered],
  );
  const newest = useMemo(
    () => [...filtered].sort(sortByNewest).slice(0, SECTION_LIMIT),
    [filtered],
  );
  const popularHub = useMemo(
    () => [...filtered].sort(sortByPopular).slice(0, SECTION_LIMIT),
    [filtered],
  );

  const popularByCategory = useMemo(() => {
    return categoryRank
      .map((cat) => ({
        category: cat,
        courses: [...filtered]
          .filter((c) => c.category === cat)
          .sort(sortByPopular)
          .slice(0, SECTION_LIMIT),
      }))
      .filter((x) => x.courses.length > 0);
  }, [filtered, categoryRank]);

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
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <nav className="text-sm text-slate-500" aria-label="パンくず">
          スキル習得 / コース
        </nav>

        <header>
          <h1 className="text-2xl font-bold text-slate-900">コース一覧</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            デジタルスキル標準（DSS）のタグ・カテゴリと連動した検索と、オンデマンド／ライブの明確な区別を両立したカタログです。フィルターはモーダルなしで即時反映されます。
          </p>
        </header>

        <CourseCatalogFilterPanel filters={filters} setFilters={setFilters} onClearAll={clearAll} />

        {!showDiscoverySections && (
          <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
            フィルターを適用中のため、上部のおすすめ・人気などのセクションは非表示です。下の「すべてのコース」で結果をご確認ください。リセットは
            <strong> すべて解除 (Clear All)</strong> から行えます。
          </p>
        )}

        {showDiscoverySections && recommended.length > 0 && (
          <section>
            <CatalogSectionHeader
              title="あなたへのおすすめ"
              hint="Recommended — パーソナライズ（モック）"
              viewAllHref="/learner/skills/courses/browse?view=recommended"
            />
            <HorizontalCourseRow
              courses={recommended}
              searchTokens={searchTokens}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onPrimary={handlePrimaryAction}
            />
          </section>
        )}

        {showDiscoverySections && upcomingLive.length > 0 && (
          <section className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-white p-5 shadow-sm md:p-6">
            <CatalogSectionHeader
              title="近日開催のライブセッション"
              hint="Upcoming Live — 開催日が近い順"
              viewAllHref="/learner/skills/courses/browse?view=upcoming-live"
            />
            <HorizontalCourseRow
              courses={upcomingLive}
              searchTokens={searchTokens}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onPrimary={handlePrimaryAction}
            />
          </section>
        )}

        {showDiscoverySections && newest.length > 0 && (
          <section>
            <CatalogSectionHeader
              title="新着コース"
              hint="New Releases"
              viewAllHref="/learner/skills/courses/browse?view=new"
            />
            <HorizontalCourseRow
              courses={newest}
              searchTokens={searchTokens}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onPrimary={handlePrimaryAction}
            />
          </section>
        )}

        {showDiscoverySections && popularHub.length > 0 && (
          <section>
            <CatalogSectionHeader
              title="Hubで人気"
              hint="Popular on Hub — モックスコア順"
              viewAllHref="/learner/skills/courses/browse?view=popular"
            />
            <HorizontalCourseRow
              courses={popularHub}
              searchTokens={searchTokens}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onPrimary={handlePrimaryAction}
            />
          </section>
        )}

        {showDiscoverySections &&
          popularByCategory.map(({ category, courses }) => (
            <section key={category}>
              <CatalogSectionHeader
                title={`「${category}」で人気`}
                hint="Popular in Category"
                viewAllHref={`/learner/skills/courses/browse?view=category&category=${encodeURIComponent(category)}`}
              />
              <HorizontalCourseRow
                courses={courses}
                searchTokens={searchTokens}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                onPrimary={handlePrimaryAction}
              />
            </section>
          ))}

        <section id="all-courses" className="scroll-mt-24">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">すべてのコース</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {filtered.length} 件（フィルター後）·{" "}
              <Link
                href="/learner/skills/courses/browse?view=popular"
                className="font-medium text-indigo-600 hover:text-indigo-800"
              >
                全件ページで開く
              </Link>
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">条件に一致するコースがありません。</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                すべて解除 (Clear All)
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...filtered].sort((a, b) => a.id - b.id).map((course) => (
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
