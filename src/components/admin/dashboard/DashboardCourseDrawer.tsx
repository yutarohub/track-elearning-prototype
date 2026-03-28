import { X } from "lucide-react";
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

export interface DashboardCourseDrawerProps {
  course: Course | null;
  onClose: () => void;
}

export function DashboardCourseDrawer({ course, onClose }: DashboardCourseDrawerProps) {
  if (!course) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="animate-fade-in-right fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 id="drawer-title" className="text-lg font-semibold text-slate-900">
            コース詳細
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-slate-900">{course.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <TypeBadge type={course.type} />
            <DifficultyBadge difficulty={course.difficulty} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">カテゴリ</dt>
              <dd className="font-medium text-slate-800">{course.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">受講者数</dt>
              <dd className="font-medium text-slate-800">{course.learners}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">想定受講時間</dt>
              <dd className="font-medium text-slate-800">{course.duration}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">進捗</dt>
              <dd>
                <ProgressIndicator completed={course.progress.completed} total={course.progress.total} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
