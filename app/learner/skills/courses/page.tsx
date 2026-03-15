"use client";

import { useState, useMemo } from "react";
import {
  MOCK_TRAINEE_COURSES,
  courseThumbnailUrl,
  type TraineeCourse,
  type TraineeCourseDelivery,
} from "@/lib/traineeCoursesMock";
import { Search, Filter, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const PER_PAGE = 20;
const DELIVERY_LABEL: Record<TraineeCourseDelivery, string> = {
  self: "自学習用",
  live: "ライブイベント",
};

function CourseCard({
  course,
  onOpen,
}: {
  course: TraineeCourse;
  onOpen: (course: TraineeCourse) => void;
}) {
  const thumb = courseThumbnailUrl(course);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full bg-slate-100">
        <img src={thumb} alt="" className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {course.delivery === "live" && (
            <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
              ライブイベント
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
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{course.title}</h3>
        {course.subtitle && (
          <p className="mt-0.5 text-sm text-slate-600">{course.subtitle}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">{course.duration}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag) => (
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
  const [filterDelivery, setFilterDelivery] = useState<"all" | TraineeCourseDelivery>("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const recommended = useMemo(
    () => MOCK_TRAINEE_COURSES.filter((c) => c.recommended),
    []
  );
  const selfStudy = useMemo(
    () => MOCK_TRAINEE_COURSES.filter((c) => c.delivery === "self"),
    []
  );
  const liveEvents = useMemo(
    () => MOCK_TRAINEE_COURSES.filter((c) => c.delivery === "live"),
    []
  );

  const allFiltered = useMemo(() => {
    let list = MOCK_TRAINEE_COURSES;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filterDelivery !== "all") {
      list = list.filter((c) => c.delivery === filterDelivery);
    }
    return list;
  }, [search, filterDelivery]);

  const totalPages = Math.ceil(allFiltered.length / PER_PAGE) || 1;
  const paginated = useMemo(
    () => allFiltered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [allFiltered, page]
  );

  function handleOpenCourse(course: TraineeCourse) {
    setToast(`「${course.title}」の学習画面は準備中です`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="space-y-8">
      {/* パンくず */}
      <nav className="text-sm text-slate-500" aria-label="パンくず">
        スキル習得 / コース
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">コース</h1>
        <p className="mt-1 text-sm text-slate-600">
          特定のテーマやスキルを集中して学べる講座です。興味のあるコースを選んで、スキルアップを始めましょう。
        </p>
      </div>

      {/* 検索・フィルタ */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="タイトルまたはキーワードで検索"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="検索"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          aria-label="フィルタ"
        >
          <Filter className="h-4 w-4" />
          フィルタ
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          aria-label="並び替え"
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          並び替え
        </button>
      </div>

      {/* おすすめ */}
      {recommended.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">おすすめ</h2>
          <CourseCardCarousel courses={recommended} onOpen={handleOpenCourse} />
        </section>
      )}

      {/* 自学習用 */}
      {selfStudy.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">自学習用</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {selfStudy.slice(0, 8).map((course) => (
              <CourseCard key={course.id} course={course} onOpen={handleOpenCourse} />
            ))}
          </div>
        </section>
      )}

      {/* ライブイベント */}
      {liveEvents.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">ライブイベント</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {liveEvents.map((course) => (
              <CourseCard key={course.id} course={course} onOpen={handleOpenCourse} />
            ))}
          </div>
        </section>
      )}

      {/* 全コース */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">全コース</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterDelivery("all")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              filterDelivery === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            すべて
          </button>
          <button
            type="button"
            onClick={() => setFilterDelivery("self")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              filterDelivery === "self"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            自学習用
          </button>
          <button
            type="button"
            onClick={() => setFilterDelivery("live")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              filterDelivery === "live"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            ライブイベント
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginated.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={handleOpenCourse} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            表示 {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, allFiltered.length)} / {allFiltered.length}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={PER_PAGE}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700"
              aria-label="1ページあたりの件数"
            >
              <option value={20}>20件</option>
              <option value={40}>40件</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                aria-label="前のページ"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                aria-label="次のページ"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* トースト */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-800 px-6 py-3 text-sm text-white shadow-lg animate-[fade-in_0.2s_ease-out]"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
