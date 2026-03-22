/**
 * 受講者スキルコースカタログ（/learner/skills/courses）用の検索・フィルタ・ハイライト
 */

import type { TraineeCourse, TraineeDifficulty } from "@/lib/traineeCoursesMock";

export type DeliveryFilterMode = "on_demand" | "live";
export type DurationBucket = "short" | "medium" | "long";

export interface CatalogFilters {
  searchRaw: string;
  selectedTags: string[];
  delivery: Record<DeliveryFilterMode, boolean>;
  liveDate: string; // yyyy-mm-dd
  difficulties: TraineeDifficulty[];
  pricePaid: boolean;
  priceFree: boolean;
  durationBucket: DurationBucket | null;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  searchRaw: "",
  selectedTags: [],
  delivery: { on_demand: true, live: true },
  liveDate: "",
  difficulties: [],
  pricePaid: true,
  priceFree: true,
  durationBucket: null,
};

/** 検索用にトークン化（空白区切り・重複除去・小文字） */
export function tokenizeSearch(raw: string): string[] {
  const parts = raw
    .trim()
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(parts));
}

/** 難易度フィルター: UIは 初級/中級/上級。入門は初級に含める */
const DIFFICULTY_GROUPS: Record<"初級" | "中級" | "上級", TraineeDifficulty[]> = {
  初級: ["入門", "初級"],
  中級: ["中級"],
  上級: ["上級"],
};

export function difficultyMatchesFilter(
  courseDifficulty: TraineeDifficulty,
  selected: TraineeDifficulty[],
): boolean {
  if (selected.length === 0) return true;
  return selected.some((sel) => {
    const group = DIFFICULTY_GROUPS[sel as keyof typeof DIFFICULTY_GROUPS];
    if (group) return group.includes(courseDifficulty);
    return courseDifficulty === sel;
  });
}

function durationMatchesBucket(minutes: number, bucket: DurationBucket | null): boolean {
  if (!bucket) return true;
  if (bucket === "short") return minutes < 180;
  if (bucket === "medium") return minutes >= 180 && minutes <= 600;
  return minutes > 600;
}

/** コースが検索トークンにマッチするか（タイトル・説明・タグ・カテゴリ・DSSラベル横断） */
export function courseMatchesTokens(course: TraineeCourse, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = [
    course.title,
    course.subtitle ?? "",
    course.description ?? "",
    course.category,
    course.dssLabel ?? "",
    ...course.tags,
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export function filterCourses(courses: TraineeCourse[], f: CatalogFilters): TraineeCourse[] {
  const tokens = tokenizeSearch(f.searchRaw);
  return courses.filter((c) => {
    if (!courseMatchesTokens(c, tokens)) return false;
    if (f.selectedTags.length > 0) {
      const hasAll = f.selectedTags.every((tag) => c.tags.includes(tag));
      if (!hasAll) return false;
    }
    const wantOnDemand = f.delivery.on_demand && c.delivery === "self";
    const wantLive = f.delivery.live && c.delivery === "live";
    if (!(wantOnDemand || wantLive)) return false;
    if (f.liveDate && c.delivery === "live" && c.liveAt) {
      const d = new Date(c.liveAt);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${day}`;
      if (key !== f.liveDate) return false;
    }
    if (!difficultyMatchesFilter(c.difficulty, f.difficulties)) return false;
    const isPaid = Boolean(c.paid);
    const priceOk =
      (isPaid && f.pricePaid) || (!isPaid && f.priceFree);
    if (!priceOk) return false;
    if (!durationMatchesBucket(c.durationMinutes, f.durationBucket)) return false;
    return true;
  });
}

/** 簡易ハイライト用: テキストをトークンで分割しマーク用チャンクに */
export function splitForHighlight(text: string, tokens: string[]): { text: string; hit: boolean }[] {
  if (!text || tokens.length === 0) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const ranges: { start: number; end: number }[] = [];
  for (const t of tokens) {
    if (!t) continue;
    let from = 0;
    while (from < lower.length) {
      const i = lower.indexOf(t, from);
      if (i === -1) break;
      ranges.push({ start: i, end: i + t.length });
      from = i + t.length;
    }
  }
  if (ranges.length === 0) return [{ text, hit: false }];
  ranges.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (!last || r.start > last.end) merged.push({ ...r });
    else last.end = Math.max(last.end, r.end);
  }
  const chunks: { text: string; hit: boolean }[] = [];
  let cursor = 0;
  for (const r of merged) {
    if (r.start > cursor) chunks.push({ text: text.slice(cursor, r.start), hit: false });
    chunks.push({ text: text.slice(r.start, r.end), hit: true });
    cursor = r.end;
  }
  if (cursor < text.length) chunks.push({ text: text.slice(cursor), hit: false });
  return chunks;
}

export function sortByPopular(a: TraineeCourse, b: TraineeCourse): number {
  return b.popularityScore - a.popularityScore;
}

export function sortByLiveSoon(a: TraineeCourse, b: TraineeCourse): number {
  const ta = a.liveAt ? new Date(a.liveAt).getTime() : Infinity;
  const tb = b.liveAt ? new Date(b.liveAt).getTime() : Infinity;
  return ta - tb;
}

export function sortByNewest(a: TraineeCourse, b: TraineeCourse): number {
  return new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime();
}

export function isFiltersDefault(f: CatalogFilters): boolean {
  return (
    f.searchRaw.trim() === "" &&
    f.selectedTags.length === 0 &&
    f.delivery.on_demand &&
    f.delivery.live &&
    f.liveDate === "" &&
    f.difficulties.length === 0 &&
    f.pricePaid &&
    f.priceFree &&
    f.durationBucket === null
  );
}

/** 一覧ページ「View All」用のビュー種別 */
export type CatalogBrowseView =
  | "recommended"
  | "upcoming-live"
  | "new"
  | "popular"
  | "category";

export function applyBrowseView(
  courses: TraineeCourse[],
  view: CatalogBrowseView,
  category: string | null,
): TraineeCourse[] {
  switch (view) {
    case "recommended":
      return courses.filter((c) => c.recommended).sort((a, b) => a.id - b.id);
    case "upcoming-live":
      return [...courses].filter((c) => c.delivery === "live").sort(sortByLiveSoon);
    case "new":
      return [...courses].sort(sortByNewest);
    case "popular":
      return [...courses].sort(sortByPopular);
    case "category":
      if (!category) return [];
      return courses.filter((c) => c.category === category).sort(sortByPopular);
    default:
      return [...courses].sort((a, b) => a.id - b.id);
  }
}

export function browseViewTitle(
  view: CatalogBrowseView,
  category: string | null,
): string {
  switch (view) {
    case "recommended":
      return "あなたへのおすすめ（全件）";
    case "upcoming-live":
      return "近日開催のライブセッション（全件）";
    case "new":
      return "新着コース（全件）";
    case "popular":
      return "Hubで人気（全件）";
    case "category":
      return category ? `「${category}」で人気（全件）` : "カテゴリ（全件）";
    default:
      return "コース一覧";
  }
}
