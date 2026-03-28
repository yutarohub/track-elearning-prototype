"use client";

import Link from "next/link";
import { Heart, Star, Video, Radio } from "lucide-react";
import type {
  TraineeCourse,
  LiveEnrollmentStatus,
  SelfPublishStatus,
} from "@/lib/traineeCoursesMock";
import { courseThumbnailUrl } from "@/lib/traineeCoursesMock";
import { splitForHighlight } from "@/lib/traineeCourseCatalog";

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

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="h-3.5 w-3.5 fill-current" />
      ))}
      {half ? <Star className="h-3.5 w-3.5 fill-amber-500/50 text-amber-500" /> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="h-3.5 w-3.5 text-slate-300" />
      ))}
    </span>
  );
}

/** 申込状況: 受付中 / 満席 / 近日 */
function liveStatusLabel(status: LiveEnrollmentStatus | undefined): string {
  if (status === "waitlist") return "満席（キャンセル待ち）";
  if (status === "next_session") return "近日開催予定";
  return "申込受付中";
}

function selfStatusLabel(status: SelfPublishStatus | undefined): string {
  return status === "coming_soon" ? "近日公開" : "公開中";
}

function HighlightedText({ text, tokens }: { text: string; tokens: string[] }) {
  const chunks = splitForHighlight(text, tokens);
  return (
    <>
      {chunks.map((c, i) =>
        c.hit ? (
          <mark key={i} className="rounded bg-amber-200/80 px-0.5 text-inherit">
            {c.text}
          </mark>
        ) : (
          <span key={i}>{c.text}</span>
        ),
      )}
    </>
  );
}

function livePrimaryCta(status: LiveEnrollmentStatus | undefined): {
  label: string;
  className: string;
} {
  if (status === "waitlist") {
    return {
      label: "キャンセル待ちに登録",
      className: "bg-amber-600 hover:bg-amber-700",
    };
  }
  if (status === "next_session") {
    return {
      label: "次回開催を確認",
      className: "bg-slate-600 hover:bg-slate-700",
    };
  }
  return {
    label: "受講を申し込む",
    className: "bg-emerald-600 hover:bg-emerald-700",
  };
}

function primaryCtaLabel(course: TraineeCourse, isLive: boolean, liveLabel: string): string {
  if (isLive) return liveLabel;
  if (course.paid && course.paidSelfFlowStatus === "pending_approval") return "承認待ち（申請済み）";
  if (course.paid && course.paidSelfFlowStatus === "none") return "有償コースを申請";
  return "今すぐ学習を開始";
}

export function SkillCourseCard({
  course,
  searchTokens,
  favorite,
  onToggleFavorite,
  onPrimaryAction,
  primaryHref,
}: {
  course: TraineeCourse;
  searchTokens: string[];
  favorite: boolean;
  onToggleFavorite: () => void;
  onPrimaryAction: (course: TraineeCourse) => void;
  /** 設定時は受講前ページへ遷移（サンプルコース用） */
  primaryHref?: string;
}) {
  const thumb = courseThumbnailUrl(course);
  const isLive = course.delivery === "live";
  const liveCta = livePrimaryCta(course.liveEnrollmentStatus);

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md ${
        isLive
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 shadow-sm ring-1 ring-slate-200/80 hover:bg-white"
        aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
        aria-pressed={favorite}
      >
        <Heart
          className={`h-4 w-4 ${favorite ? "fill-rose-500 text-rose-500" : "text-slate-500"}`}
        />
      </button>

      <div className="relative h-36 w-full bg-slate-100">
        <img src={thumb} alt="" className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1 pr-10">
          {isLive ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Radio className="h-3 w-3" />
              ライブセッション
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Video className="h-3 w-3" />
              オンデマンド
            </span>
          )}
          {course.paid ? (
            <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              有料
            </span>
          ) : (
            <span className="rounded-md bg-slate-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
              無料
            </span>
          )}
        </div>
        {isLive && course.liveAt && (
          <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/65 px-2 py-1 text-[10px] text-white">
            {formatLiveAt(course.liveAt)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="pr-8 font-semibold leading-snug text-slate-900">
          <HighlightedText text={course.title} tokens={searchTokens} />
        </h3>
        {course.subtitle && (
          <p className="mt-1 text-sm text-slate-600">
            <HighlightedText text={course.subtitle} tokens={searchTokens} />
          </p>
        )}

        <div className="mt-2 flex min-h-[28px] flex-wrap items-center gap-2 text-xs text-slate-600">
          {course.reviewCount < 5 ? (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-800">
              New
            </span>
          ) : (
            <>
              <Stars value={course.ratingAvg} />
              <span className="font-medium text-slate-800">
                {course.ratingAvg.toFixed(1)}
              </span>
              <span className="text-slate-500">★({course.reviewCount})</span>
            </>
          )}
        </div>

        {isLive ? (
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            <p>
              <span className="font-medium text-slate-700">申込・定員: </span>
              {course.liveEnrollmentStatus === "next_session"
                ? "次回日程調整中"
                : course.liveSeatsLeft != null && course.liveSeatsTotal != null
                  ? `残席 ${course.liveSeatsLeft} / ${course.liveSeatsTotal}`
                  : "定員情報はお申し込み時に表示"}
            </p>
            {course.liveProgramPeriod && (
              <p>
                <span className="font-medium text-slate-700">プログラム期間: </span>
                {course.liveProgramPeriod}
              </p>
            )}
            <p>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  course.liveEnrollmentStatus === "waitlist"
                    ? "bg-amber-100 text-amber-900"
                    : course.liveEnrollmentStatus === "next_session"
                      ? "bg-slate-200 text-slate-800"
                      : "bg-emerald-100 text-emerald-900"
                }`}
              >
                {liveStatusLabel(course.liveEnrollmentStatus)}
              </span>
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            <p>
              <span className="font-medium text-slate-700">所要時間: </span>
              {course.duration}
            </p>
            <p>
              <span className="font-medium text-slate-700">レベル: </span>
              {course.difficulty}
            </p>
            <p>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  course.selfPublishStatus === "coming_soon"
                    ? "bg-indigo-100 text-indigo-900"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {selfStatusLabel(course.selfPublishStatus)}
              </span>
            </p>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-1">
          {course.dssLabel && (
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-800">
              {course.dssLabel}
            </span>
          )}
          {course.tags
            .filter((t) => t !== "ライブイベント")
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
              >
                <HighlightedText text={tag} tokens={searchTokens} />
              </span>
            ))}
        </div>

        <div className="mt-auto pt-4">
          {!isLive && course.paid && course.paidSelfFlowStatus === "pending_approval" && (
            <p className="mb-2 text-center text-[11px] font-medium text-amber-800">
              申請済み · 管理者の承認待ち
            </p>
          )}
          {primaryHref ? (
            <Link
              href={primaryHref}
              className={`flex w-full items-center justify-center rounded-lg py-2.5 text-center text-sm font-semibold text-white shadow-sm transition ${
                isLive
                  ? liveCta.className
                  : course.paid && course.paidSelfFlowStatus === "pending_approval"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : course.paid && course.paidSelfFlowStatus === "none"
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {primaryCtaLabel(course, isLive, liveCta.label)}
            </Link>
          ) : (
            <button
              type="button"
              disabled={!isLive && course.paid && course.paidSelfFlowStatus === "pending_approval"}
              onClick={() => onPrimaryAction(course)}
              className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isLive
                  ? liveCta.className
                  : course.paid && course.paidSelfFlowStatus === "pending_approval"
                    ? "bg-amber-500"
                    : course.paid && course.paidSelfFlowStatus === "none"
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {primaryCtaLabel(course, isLive, liveCta.label)}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
