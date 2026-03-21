"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MOCK_TRAINEE_COURSES,
  ALL_TRAINEE_COURSE_TAGS,
  type TraineeCourse,
  type DssQuadrant,
} from "@/lib/traineeCoursesMock";
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
import {
  Search,
  ChevronRight,
  Target,
  Diamond,
  Zap,
  Brain,
  PieChart,
  Shield,
  Cloud,
  FolderKanban,
  Lightbulb,
  PencilRuler,
  Gauge,
  User,
  BookOpen,
  X,
  CalendarDays,
  Filter,
} from "lucide-react";

const SECTION_LIMIT = 8;

const DSS_PANEL: {
  quadrant: DssQuadrant;
  title: string;
  items: { id: string; label: string; icon: React.ReactNode }[];
}[] = [
  {
    quadrant: "why",
    title: "Why（DXの背景）",
    items: [
      { id: "dx", label: "DXの実現", icon: <Target className="h-5 w-5" /> },
      { id: "business", label: "ビジネス変革", icon: <Diamond className="h-5 w-5" /> },
      { id: "strategy", label: "戦略・組織", icon: <Zap className="h-5 w-5" /> },
    ],
  },
  {
    quadrant: "what",
    title: "What（データ・技術）",
    items: [
      { id: "ai", label: "AI", icon: <Brain className="h-5 w-5" /> },
      { id: "data", label: "データ分析", icon: <PieChart className="h-5 w-5" /> },
      { id: "security", label: "サイバーセキュリティ", icon: <Shield className="h-5 w-5" /> },
      { id: "cloud", label: "クラウド", icon: <Cloud className="h-5 w-5" /> },
    ],
  },
  {
    quadrant: "how",
    title: "How（データ・技術の利活用）",
    items: [
      { id: "efficiency", label: "業務効率化", icon: <FolderKanban className="h-5 w-5" /> },
      { id: "newbusiness", label: "新規事業開発", icon: <Lightbulb className="h-5 w-5" /> },
      { id: "design", label: "デザイン思考", icon: <PencilRuler className="h-5 w-5" /> },
    ],
  },
  {
    quadrant: "mindset",
    title: "Mindset（マインド・スタンス）",
    items: [
      { id: "agile", label: "アジャイル", icon: <Gauge className="h-5 w-5" /> },
      { id: "ownership", label: "オーナーシップ", icon: <User className="h-5 w-5" /> },
      { id: "learning", label: "継続的学習", icon: <BookOpen className="h-5 w-5" /> },
    ],
  },
];

const QUADRANT_LABELS: Record<DssQuadrant, string> = {
  why: "Why（DXの背景）",
  what: "What（データ・技術）",
  how: "How（データ・技術の利活用）",
  mindset: "Mindset（マインド・スタンス）",
};

type CatalogScope =
  | { kind: "all" }
  | { kind: "recommended" }
  | { kind: "popular" }
  | { kind: "live_upcoming" }
  | { kind: "dss"; quadrant: DssQuadrant }
  | { kind: "new" };

function applyScope(courses: TraineeCourse[], scope: CatalogScope): TraineeCourse[] {
  switch (scope.kind) {
    case "all":
      return [...courses].sort((a, b) => a.id - b.id);
    case "recommended":
      return courses.filter((c) => c.recommended).sort((a, b) => a.id - b.id);
    case "popular":
      return [...courses].sort(sortByPopular);
    case "live_upcoming":
      return [...courses].filter((c) => c.delivery === "live").sort(sortByLiveSoon);
    case "new":
      return [...courses].sort(sortByNewest);
    case "dss":
      return courses
        .filter((c) => c.dssQuadrant === scope.quadrant)
        .sort((a, b) => a.id - b.id);
    default:
      return courses;
  }
}

const DIFF_OPTIONS = ["初級", "中級", "上級"] as const;

const FAVORITES_KEY = "skill-catalog-favorites-v1";

function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as number[];
      if (Array.isArray(parsed)) setFavoriteIds(new Set(parsed));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { favoriteIds, toggleFavorite };
}

function CatalogSectionHeader({
  title,
  hint,
  onViewAll,
}: {
  title: string;
  hint?: string;
  onViewAll: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        View All
        <ChevronRight className="h-4 w-4" />
      </button>
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
  const [scope, setScope] = useState<CatalogScope>({ kind: "all" });
  const [toast, setToast] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const searchTokens = useMemo(() => tokenizeSearch(filters.searchRaw), [filters.searchRaw]);

  const filtered = useMemo(() => filterCourses(MOCK_TRAINEE_COURSES, filters), [filters]);

  const defaultFilters = isFiltersDefault(filters);
  const showDiscoverySections = defaultFilters && scope.kind === "all";

  const recommended = useMemo(
    () => filtered.filter((c) => c.recommended).slice(0, SECTION_LIMIT),
    [filtered],
  );
  const popular = useMemo(
    () => [...filtered].sort(sortByPopular).slice(0, SECTION_LIMIT),
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

  const coursesByQuadrant = useMemo(() => {
    const map: Record<DssQuadrant, TraineeCourse[]> = {
      why: [],
      what: [],
      how: [],
      mindset: [],
    };
    filtered.forEach((c) => {
      if (c.dssQuadrant && map[c.dssQuadrant]) map[c.dssQuadrant].push(c);
    });
    return map;
  }, [filtered]);

  const allScoped = useMemo(() => applyScope(filtered, scope), [filtered, scope]);

  function scrollToAll() {
    document.getElementById("all-courses")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleViewAll(next: CatalogScope) {
    setScope(next);
    setTimeout(scrollToAll, 0);
  }

  function clearAll() {
    setFilters(DEFAULT_CATALOG_FILTERS);
    setScope({ kind: "all" });
  }

  const hasActive =
    !isFiltersDefault(filters) || scope.kind !== "all";

  function handlePrimaryAction(course: TraineeCourse) {
    setToast(
      course.delivery === "live"
        ? `「${course.title}」の受講申込フローは準備中です（モック）`
        : `「${course.title}」の学習を開始します（モック）`,
    );
    setTimeout(() => setToast(null), 3200);
  }

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <nav className="text-sm text-slate-500" aria-label="パンくず">
          スキル習得 / コース
        </nav>

        <header>
          <h1 className="text-2xl font-bold text-slate-900">コース一覧</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            オンデマンドとライブセッションを分けて探せるスキル習得カタログです。検索は複数キーワードに対応し、タグ・形式・日程・難易度などを常時表示のフィルターから絞り込めます。
          </p>
        </header>

        {/* 常時表示フィルター */}
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
              onClick={clearAll}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                hasActive
                  ? "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
              }`}
              disabled={!hasActive}
            >
              <X className="h-3.5 w-3.5" />
              Clear All
            </button>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="複数キーワード可（スペース区切り）— タイトル・タグ・カテゴリ・説明を検索"
              value={filters.searchRaw}
              onChange={(e) => setFilters((f) => ({ ...f, searchRaw: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-label="コース検索"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p
                className="mb-2 text-xs font-medium text-slate-600"
                title="複数選択すると、すべてのタグを含むコースに絞り込みます"
              >
                タグ（複数選択）
              </p>
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

            <div className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-600">配信形式</p>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
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
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
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
                    ライブセッション
                  </label>
                </div>
              </div>
              <div>
                <p
                  className="mb-2 text-xs font-medium text-slate-600"
                  title="開催日が一致するライブセッションに絞り込みます"
                >
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    ライブ開催日
                  </span>
                </p>
                <input
                  type="date"
                  value={filters.liveDate}
                  onChange={(e) => setFilters((f) => ({ ...f, liveDate: e.target.value }))}
                  className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p
                className="mb-2 text-xs font-medium text-slate-600"
                title="入門レベルは「初級」に含めて絞り込みます"
              >
                難易度
              </p>
              <div className="flex flex-wrap gap-2">
                {DIFF_OPTIONS.map((d) => {
                  const on = filters.difficulties.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDifficulty(d)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        on
                          ? "bg-violet-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
            <div className="sm:col-span-2 lg:col-span-2">
              <p className="mb-2 text-xs font-medium text-slate-600">所要時間（おおよそ）</p>
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
                        on
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {scope.kind !== "all" ? (
            <p className="text-xs text-indigo-700">
              表示中:{" "}
              <strong>
                {scope.kind === "recommended" && "あなたへのおすすめ（全件）"}
                {scope.kind === "popular" && "人気コース（全件・人気順）"}
                {scope.kind === "live_upcoming" && "近日開催ライブ（全件・日付順）"}
                {scope.kind === "new" && "新着コース（全件・新しい順）"}
                {scope.kind === "dss" && `${QUADRANT_LABELS[scope.quadrant]}（全件）`}
              </strong>
              。クリアで全体表示に戻ります。
            </p>
          ) : null}
        </section>

        {/* ディスカバリーセクション（デフォルトフィルター時のみ） */}
        {showDiscoverySections && recommended.length > 0 && (
          <section>
            <CatalogSectionHeader
              title="あなたへのおすすめ"
              hint="パーソナライズされた提案（モック）"
              onViewAll={() => handleViewAll({ kind: "recommended" })}
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

        {showDiscoverySections && popular.length > 0 && (
          <section>
            <CatalogSectionHeader
              title="人気コース"
              hint="Hub 内の登録・修了傾向に基づく人気順（モックスコア）"
              onViewAll={() => handleViewAll({ kind: "popular" })}
            />
            <HorizontalCourseRow
              courses={popular}
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
              hint="開催日が近い順"
              onViewAll={() => handleViewAll({ kind: "live_upcoming" })}
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

        {showDiscoverySections && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 text-center text-base font-semibold text-slate-800">
              DSS（デジタルスキル標準）から探す
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DSS_PANEL.map((block) => (
                <div key={block.quadrant}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {block.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {block.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleViewAll({ kind: "dss", quadrant: block.quadrant })}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-800"
                      >
                        <span className="text-slate-500">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {showDiscoverySections &&
          (["why", "what", "how", "mindset"] as const).map((quadrant) => {
            const list = coursesByQuadrant[quadrant].slice(0, SECTION_LIMIT);
            if (list.length === 0) return null;
            return (
              <section key={quadrant}>
                <CatalogSectionHeader
                  title={`${QUADRANT_LABELS[quadrant]} のコース`}
                  onViewAll={() => handleViewAll({ kind: "dss", quadrant })}
                />
                <HorizontalCourseRow
                  courses={list}
                  searchTokens={searchTokens}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={toggleFavorite}
                  onPrimary={handlePrimaryAction}
                />
              </section>
            );
          })}

        {showDiscoverySections && newest.length > 0 && (
          <section>
            <CatalogSectionHeader
              title="新着コース"
              hint="直近で公開されたコンテンツ（モック日付）"
              onViewAll={() => handleViewAll({ kind: "new" })}
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

        {/* すべてのコース */}
        <section id="all-courses" className="scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">すべてのコース</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {allScoped.length} 件表示（フィルター後）
              </p>
            </div>
          </div>

          {allScoped.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">条件に一致するコースがありません。</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Clear All
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {allScoped.map((course) => (
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
