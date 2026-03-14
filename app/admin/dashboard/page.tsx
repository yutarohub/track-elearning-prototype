"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EnrollmentChart } from "@/components/dashboard/EnrollmentChart";
import { ProgressIndicator } from "@/components/dashboard/ProgressIndicator";
import { MOCK_COURSES, MOCK_BADGES } from "@/lib/mockData";
import type { Course, CourseDelivery } from "@/lib/mockData";
import { Pencil, UserPlus } from "lucide-react";

const enrollmentAll = 320;
const enrollmentSelf = 280;
const enrollmentLive = 88;
const cohortData = [
  { name: "完了", count: 145 },
  { name: "進行中", count: 98 },
  { name: "未着手", count: 77 },
];

function DifficultyBadge({ difficulty }: { difficulty: Course["difficulty"] }) {
  const styles: Record<Course["difficulty"], string> = {
    入門: "bg-sky-100 text-sky-800",
    初級: "bg-emerald-100 text-emerald-800",
    中級: "bg-amber-100 text-amber-800",
    上級: "bg-rose-100 text-rose-800",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function DeliveryBadge({ delivery }: { delivery: CourseDelivery }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
      {delivery === "self" ? "自学習" : "ライブ"}
    </span>
  );
}

export default function DashboardPage() {
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "self" | "live">("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    if (deliveryFilter === "all") return MOCK_COURSES;
    return MOCK_COURSES.filter((c) => c.delivery === deliveryFilter);
  }, [deliveryFilter]);

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            総受講者数
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{enrollmentAll}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            アクティブコース数
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{MOCK_COURSES.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            修了数
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {MOCK_COURSES.reduce((s, c) => s + c.progress.completed, 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            バッジ発行数
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {MOCK_BADGES.reduce((s, b) => s + b.issued, 0)}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">受講トレンド</h2>
        <EnrollmentChart />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900">コース一覧</h2>
        <div className="flex gap-2">
          {(["all", "self", "live"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setDeliveryFilter(key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                deliveryFilter === key
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {key === "all" ? "すべて" : key === "self" ? "自学習" : "ライブ"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.slice(0, 9).map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourse(course)}
                className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <p className="font-medium text-slate-900 line-clamp-2">{course.title}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <DifficultyBadge difficulty={course.difficulty} />
                  <DeliveryBadge delivery={course.delivery} />
                </div>
                <div className="mt-3">
                  <ProgressIndicator
                    completed={course.progress.completed}
                    total={course.progress.total}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="w-80 shrink-0 animate-fade-in-right rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <h3 className="font-semibold text-slate-900">{selectedCourse.title}</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="text-slate-500">難易度:</span>{" "}
                <DifficultyBadge difficulty={selectedCourse.difficulty} />
              </p>
              <p>
                <span className="text-slate-500">配信:</span>{" "}
                <DeliveryBadge delivery={selectedCourse.delivery} />
              </p>
              <p>
                <span className="text-slate-500">タグ:</span>{" "}
                {selectedCourse.tags.join(", ")}
              </p>
              <p>
                <span className="text-slate-500">進捗:</span>{" "}
                {selectedCourse.progress.completed} / {selectedCourse.progress.total}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-violet-500"
              >
                <Pencil className="h-4 w-4" />
                編集する
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserPlus className="h-4 w-4" />
                受講者をアサイン
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
