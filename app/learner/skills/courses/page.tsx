"use client";

import { useState, useMemo } from "react";
import {
  MOCK_TRAINEE_COURSES,
  courseThumbnailUrl,
  type TraineeCourse,
  type DssQuadrant,
} from "@/lib/traineeCoursesMock";
import {
  Search,
  ChevronRight,
  ExternalLink,
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
  Video,
  X,
  Radio,
  CalendarClock,
} from "lucide-react";

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

function formatLiveAt(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ja-JP", {
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function CourseCard({
  course,
  onOpen,
}: {
  course: TraineeCourse;
  onOpen: (course: TraineeCourse) => void;
}) {
  const thumb = courseThumbnailUrl(course);
  const isLive = course.delivery === "live";

  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md ${
        isLive
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="relative h-40 w-full bg-slate-100">
        <img src={thumb} alt="" className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {isLive && (
            <span className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Live
            </span>
          )}
          {!isLive && (
            <span className="flex items-center gap-1 rounded bg-slate-600 px-2 py-0.5 text-[10px] font-medium text-white">
              <Video className="h-3 w-3" />
              eラーニング
            </span>
          )}
          {course.paid && (
            <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-white">
              有償
            </span>
          )}
          <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            {course.difficulty}
          </span>
        </div>
        {isLive && course.liveAt && (
          <div className="absolute bottom-2 left-2 right-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
            {formatLiveAt(course.liveAt)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{course.title}</h3>
        {course.subtitle && (
          <p className="mt-0.5 text-sm text-slate-600">{course.subtitle}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">{course.duration}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {course.dssLabel && (
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
              {course.dssLabel}
            </span>
          )}
          {course.tags
            .filter((t) => t !== "ライブイベント" && t !== "有償")
            .slice(0, 2)
            .map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
              >
                {tag}
              </span>
            ))}
        </div>
        <button
          type="button"
          onClick={() => onOpen(course)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          講座受講サイトを開く
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CourseCardCarousel({
  courses,
  onOpen,
}: {
  courses: TraineeCourse[];
  onOpen: (course: TraineeCourse) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {courses.map((course) => (
        <div key={course.id} className="w-72 shrink-0">
          <CourseCard course={course} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}

export default function LearnerSkillsCoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState<DssQuadrant | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const recommended = useMemo(
    () => MOCK_TRAINEE_COURSES.filter((c) => c.recommended),
    []
  );
  const liveEvents = useMemo(
    () => MOCK_TRAINEE_COURSES.filter((c) => c.delivery === "live"),
    []
  );
  const selfStudy = useMemo(
    () => MOCK_TRAINEE_COURSES.filter((c) => c.delivery === "self"),
    []
  );

  const filteredBySearchAndQuadrant = useMemo(() => {
    let list = MOCK_TRAINEE_COURSES;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.dssLabel?.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedQuadrant) {
      list = list.filter((c) => c.dssQuadrant === selectedQuadrant);
    }
    return list;
  }, [search, selectedQuadrant]);

  const coursesByQuadrant = useMemo(() => {
    const map: Record<DssQuadrant, TraineeCourse[]> = {
      why: [],
      what: [],
      how: [],
      mindset: [],
    };
    MOCK_TRAINEE_COURSES.forEach((c) => {
      if (c.dssQuadrant && map[c.dssQuadrant]) {
        map[c.dssQuadrant].push(c);
      }
    });
    return map;
  }, []);

  function handleOpenCourse(course: TraineeCourse) {
    setToast(`「${course.title}」の学習画面は準備中です`);
    setTimeout(() => setToast(null), 3000);
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  }

  const isEmpty = filteredBySearchAndQuadrant.length === 0;
  const hasActiveFilter = search.trim() !== "" || selectedQuadrant !== null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* パンくず */}
        <nav className="text-sm text-slate-500" aria-label="パンくず">
          スキル習得 / コース
        </nav>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">コース</h1>
          <p className="mt-1 text-sm text-slate-600">
            特定のテーマやスキルを集中して学べる講座です。DSSカテゴリから「なぜ学ぶか」「何を学ぶか」「どう活用するか」で探せます。
          </p>
        </div>

        {/* 1. Global Search & Filter */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="タイトルまたはキーワードで検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label="検索"
              />
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedQuadrant(null);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                検索をリセット
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["why", "what", "how", "mindset"] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSelectedQuadrant(selectedQuadrant === q ? null : q)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedQuadrant === q
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                }`}
              >
                {QUADRANT_LABELS[q]}
              </button>
            ))}
          </div>
        </section>

        {/* 2. Featured Selection */}
        {recommended.length > 0 && !hasActiveFilter && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">おすすめ</h2>
            <CourseCardCarousel courses={recommended} onOpen={handleOpenCourse} />
          </section>
        )}

        {/* 2b. ライブイベント（おすすめの直下・申請期間を強調） */}
        {liveEvents.length > 0 && !hasActiveFilter && (
          <section className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-md">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Radio className="h-4 w-4" />
                </span>
                ライブイベント
              </h2>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                <CalendarClock className="h-4 w-4" />
                申請期間あり — お早めにお申し込みください
              </span>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              開催日時が決まったライブ講座です。定員があるため、申込期間内にお申し込みください。
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {liveEvents.map((course) => (
                <div key={course.id} className="w-72 shrink-0">
                  <CourseCard course={course} onOpen={handleOpenCourse} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Browse by DSS Categories (マナビDXスタイル) */}
        {!hasActiveFilter && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-center text-base font-semibold text-slate-800">
              Q カテゴリから「あなたにぴったりな講座」を見つけよう!
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
                        onClick={() => {
                          setSelectedQuadrant(block.quadrant);
                          scrollToSection("all-courses");
                        }}
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

        {/* 4. Learning Context Sections (Why / What / How / Mindset) */}
        {!hasActiveFilter &&
          (["why", "what", "how", "mindset"] as const).map((quadrant) => {
            const list = coursesByQuadrant[quadrant];
            if (list.length === 0) return null;
            return (
              <section key={quadrant} id={`section-${quadrant}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {QUADRANT_LABELS[quadrant]} が学べる人気の講座
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuadrant(quadrant);
                      scrollToSection("all-courses");
                    }}
                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    すべて見る
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {list.slice(0, 5).map((course) => (
                    <div key={course.id} className="w-72 shrink-0">
                      <CourseCard course={course} onOpen={handleOpenCourse} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

        {/* 5. All Courses / Live Events（フィルタ結果 or 全体） */}
        <section id="all-courses">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {selectedQuadrant ? `${QUADRANT_LABELS[selectedQuadrant]} — 一覧` : "すべてのコース"}
          </h2>

          {isEmpty ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">
                該当するコースが見つかりませんでした。キーワードを変えてお試しください。
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedQuadrant(null);
                }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                検索をリセット
              </button>
            </div>
          ) : (
            <>
              {/* フィルタ時のみここにライブを表示（通常時は上部の目立つブロックで表示済み） */}
              {hasActiveFilter &&
                filteredBySearchAndQuadrant.some((c) => c.delivery === "live") && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">ライブイベント</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {filteredBySearchAndQuadrant
                        .filter((c) => c.delivery === "live")
                        .map((course) => (
                          <CourseCard key={course.id} course={course} onOpen={handleOpenCourse} />
                        ))}
                    </div>
                  </div>
                )}
              {filteredBySearchAndQuadrant.some((c) => c.delivery === "self") && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">eラーニングコース</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredBySearchAndQuadrant
                      .filter((c) => c.delivery === "self")
                      .map((course) => (
                        <CourseCard key={course.id} course={course} onOpen={handleOpenCourse} />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {toast && (
          <div
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-800 px-6 py-3 text-sm text-white shadow-lg"
            role="status"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
