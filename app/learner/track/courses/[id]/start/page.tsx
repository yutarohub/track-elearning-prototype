"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  MOCK_TRAINEE_COURSES,
  courseThumbnailUrl,
  hasSampleCourseStartPage,
} from "@/lib/traineeCoursesMock";
import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { ArrowLeft, Radio, Video } from "lucide-react";

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
    return iso;
  }
}

/** サンプル修了時にスキル更新モックへ紐づけるID */
const SAMPLE_SKILL_BY_COURSE: Record<number, string> = {
  3: "skill-gemini-basics",
  7: "skill-python-data",
  1: "skill-dify-agent",
};

export default function CourseStartPage() {
  const params = useParams();
  const raw = params.id;
  const id = typeof raw === "string" ? parseInt(raw, 10) : NaN;
  const { markCourseCompleted, addBadge, addUpdatedSkill, completedCourseIds } = useLearnerProgress();
  const [toast, setToast] = useState<string | null>(null);

  const course = useMemo((): (typeof MOCK_TRAINEE_COURSES)[number] | null => {
    if (!Number.isFinite(id)) return null;
    const c = MOCK_TRAINEE_COURSES.find((x) => x.id === id);
    if (!c || !hasSampleCourseStartPage(c.id)) return null;
    return c;
  }, [id]);

  if (course === null) {
    notFound();
  }

  const c = course;
  const isLive = c.delivery === "live";
  const thumb = courseThumbnailUrl(c);
  const alreadyDone = completedCourseIds.includes(c.id);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleMockComplete() {
    markCourseCompleted(c.id);
    addBadge(`badge-course-${c.id}`);
    const sk = SAMPLE_SKILL_BY_COURSE[c.id];
    if (sk) addUpdatedSkill(sk);
    showToast("モック修了を記録しました（学習歴・バッジに反映）");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/learner/track/courses"
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" />
        コース一覧に戻る
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-48 w-full bg-slate-100">
          <img src={thumb} alt="" className="h-full w-full object-cover" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                <Radio className="h-3.5 w-3.5" />
                ライブ
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-white">
                <Video className="h-3.5 w-3.5" />
                オンデマンド
              </span>
            )}
            {c.paid ? (
              <span className="rounded-md bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
                有料
              </span>
            ) : (
              <span className="rounded-md bg-slate-600 px-2 py-1 text-xs font-semibold text-white">
                無料
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">{c.title}</h1>
          {c.subtitle && <p className="mt-2 text-slate-600">{c.subtitle}</p>}
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">所要時間</dt>
              <dd className="font-medium text-slate-900">{c.duration}</dd>
            </div>
            <div>
              <dt className="text-slate-500">レベル</dt>
              <dd className="font-medium text-slate-900">{c.difficulty}</dd>
            </div>
            {isLive && c.liveAt && (
              <div className="sm:col-span-2">
                <dt className="text-slate-500">開催</dt>
                <dd className="font-medium text-slate-900">{formatLiveAt(c.liveAt)}</dd>
              </div>
            )}
          </dl>
          {c.description && (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{c.description}</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <h2 className="text-lg font-semibold text-slate-900">受講開始前</h2>
        <p className="mt-1 text-sm text-slate-600">
          実際の教材プレイヤーは未接続です。以下は Miro / prod フローに沿ったモック操作です。
        </p>

        <div className="mt-6 space-y-3">
          {isLive && (
            <button
              type="button"
              onClick={() => showToast("ライブ申込フローを送信しました（モック）")}
              className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              受講を申し込む
            </button>
          )}

          {!isLive && !c.paid && (
            <button
              type="button"
              onClick={() => showToast("受講を開始しました（プレイヤーは次フェーズ）")}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              受講を開始
            </button>
          )}

          {!isLive && c.paid && c.paidSelfFlowStatus === "none" && (
            <button
              type="button"
              onClick={() => showToast("有償受講の申請を送信しました（モック）")}
              className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white shadow hover:bg-violet-700"
            >
              申請する
            </button>
          )}

          {!isLive && c.paid && c.paidSelfFlowStatus === "pending_approval" && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              申請済みです。管理者の承認をお待ちください。承認後に「受講を開始」が利用できる想定です（モック）。
            </p>
          )}

          {!isLive && c.paid && c.paidSelfFlowStatus === "approved" && (
            <button
              type="button"
              onClick={() => showToast("受講を開始しました（モック）")}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              受講を開始
            </button>
          )}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            次フェーズ用デモ
          </p>
          <button
            type="button"
            disabled={alreadyDone}
            onClick={handleMockComplete}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {alreadyDone ? "モック修了済み" : "モック: 受講を完了する（バッジ・スキル記録）"}
          </button>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-lg bg-slate-900 px-5 py-3 text-center text-sm text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
