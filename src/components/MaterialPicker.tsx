"use client";

import { useState, useMemo } from "react";
import { Filter, Search, ExternalLink } from "lucide-react";
import type { LibraryMaterialCategory } from "@/lib/libraryMock";
import {
  MOCK_LIBRARY_BOOKS,
  MOCK_LIBRARY_SURVEYS,
  MOCK_LIBRARY_VIDEOS,
  MOCK_LIBRARY_FILES,
  MOCK_LIBRARY_APPS,
  MOCK_LIBRARY_SLIDES,
  MOCK_LIBRARY_COURSES,
  MOCK_LIBRARY_LEARNING_PATHS,
} from "@/lib/libraryMock";

type PickerTab = LibraryMaterialCategory | "course" | "learningpath";

const MATERIAL_TABS: { id: PickerTab; label: string }[] = [
  { id: "book", label: "ブック" },
  { id: "survey", label: "アンケート" },
  { id: "video", label: "動画" },
  { id: "app", label: "アプリ" },
  { id: "file", label: "ファイル" },
  { id: "slide", label: "スライド" },
  { id: "course", label: "コース" },
  { id: "learningpath", label: "学習パス" },
];

type CategoryFilter = "Track公式" | "自社オリジナル" | null;
type LanguageFilter = "日本語" | "英語" | null;

export type PickedMaterial = { type: LibraryMaterialCategory | "course" | "learningpath"; id: number; label: string };

const CM_BASE_URL = "https://cm.tracks.run";

function Badge({ kind }: { kind: string }) {
  const style =
    kind === "Track公式"
      ? "bg-sky-100 text-sky-800 border border-sky-200"
      : kind === "自社オリジナル"
        ? "bg-slate-100 text-slate-700"
        : kind === "New"
          ? "bg-red-100 text-red-700"
          : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {kind}
    </span>
  );
}

interface MaterialPickerProps {
  selected: PickedMaterial[];
  onSelectionChange: (selected: PickedMaterial[]) => void;
  /** 最大選択数（0=制限なし） */
  maxSelection?: number;
  /** コース・学習パスのみ表示（既存コース紐づけ用） */
  courseOnly?: boolean;
  className?: string;
}

const MATERIAL_TABS_COURSE_ONLY: { id: PickerTab; label: string }[] = [
  { id: "course", label: "コース" },
  { id: "learningpath", label: "学習パス" },
];

export function MaterialPicker({ selected, onSelectionChange, maxSelection = 0, courseOnly = false, className = "" }: MaterialPickerProps) {
  const tabs = courseOnly ? MATERIAL_TABS_COURSE_ONLY : MATERIAL_TABS;
  const effectiveMax = courseOnly ? 1 : maxSelection;
  const [tab, setTab] = useState<PickerTab>(courseOnly ? "course" : "book");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(null);
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedSet = useMemo(
    () => new Set(selected.map((s) => `${s.type}-${s.id}`)),
    [selected]
  );

  function toggle(item: PickedMaterial) {
    const key = `${item.type}-${item.id}`;
    if (selectedSet.has(key)) {
      onSelectionChange(selected.filter((s) => `${s.type}-${s.id}` !== key));
    } else if (effectiveMax === 0 || selected.length < effectiveMax) {
      if (courseOnly) onSelectionChange([item]);
      else onSelectionChange([...selected, item]);
    }
  }

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byCategory = (badges: string[]) => {
      if (!categoryFilter) return true;
      return badges.includes(categoryFilter);
    };
    const byLanguage = (lang: string) => {
      if (!languageFilter) return true;
      return lang === languageFilter;
    };

    if (tab === "book") {
      return MOCK_LIBRARY_BOOKS.filter(
        (b) => byCategory(b.badges) && byLanguage(b.language) && (!q || b.name.toLowerCase().includes(q))
      ).map((b) => ({ type: "book" as const, id: b.id, label: b.name, language: b.language, badges: b.badges }));
    }
    if (tab === "survey") {
      return MOCK_LIBRARY_SURVEYS.filter(
        (s) => byCategory(s.badges) && (!q || s.title.toLowerCase().includes(q))
      ).map((s) => ({ type: "survey" as const, id: s.id, label: s.title, language: null as string | null, badges: s.badges }));
    }
    if (tab === "video") {
      return MOCK_LIBRARY_VIDEOS.filter(
        (v) => byCategory(v.badges) && (!q || v.title.toLowerCase().includes(q))
      ).map((v) => ({ type: "video" as const, id: v.id, label: v.title, language: null, badges: v.badges }));
    }
    if (tab === "file") {
      return MOCK_LIBRARY_FILES.filter(
        (f) => byCategory(f.badges) && (!q || f.title.toLowerCase().includes(q))
      ).map((f) => ({ type: "file" as const, id: f.id, label: f.title, language: null, badges: f.badges }));
    }
    if (tab === "app") {
      return MOCK_LIBRARY_APPS.filter(
        (a) => byCategory(a.badges) && (!q || a.name.toLowerCase().includes(q))
      ).map((a) => ({ type: "app" as const, id: a.id, label: a.name, language: null, badges: a.badges }));
    }
    if (tab === "slide") {
      return MOCK_LIBRARY_SLIDES.filter(
        (s) => byCategory(s.badges) && byLanguage(s.language) && (!q || s.title.toLowerCase().includes(q))
      ).map((s) => ({ type: "slide" as const, id: s.id, label: s.title, language: s.language, badges: s.badges }));
    }
    if (tab === "course") {
      return MOCK_LIBRARY_COURSES.filter(
        (c) => byCategory(c.badges) && (!q || c.title.toLowerCase().includes(q))
      ).map((c) => ({ type: "course" as const, id: c.id, label: c.title, language: null as string | null, badges: c.badges, estimatedTime: c.estimatedTime }));
    }
    if (tab === "learningpath") {
      return MOCK_LIBRARY_LEARNING_PATHS.filter(
        (l) => byCategory(l.badges) && (!q || l.title.toLowerCase().includes(q))
      ).map((l) => ({ type: "learningpath" as const, id: l.id, label: l.title, language: null, badges: l.badges, estimatedTime: l.estimatedTime }));
    }
    return [];
  }, [tab, search, categoryFilter, languageFilter]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="フィルター"
          >
            <Filter className="h-4 w-4" />
          </button>
          <Search className="absolute left-8 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Q 検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-20 pr-3 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        {filterOpen && !courseOnly && (
          <div className="flex w-full flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50/80 p-3 animate-[fade-in_0.2s_ease-out]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">カテゴリー</span>
              {(["Track公式", "自社オリジナル"] as const).map((c) => (
                <label key={c} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryFilter === c}
                    onChange={() => setCategoryFilter(categoryFilter === c ? null : c)}
                    className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {c}
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">言語</span>
              {(["日本語", "英語"] as const).map((lang) => (
                <label key={lang} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="radio"
                    name="language"
                    checked={languageFilter === lang}
                    onChange={() => setLanguageFilter(languageFilter === lang ? null : lang)}
                    className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden">
        <aside className="w-40 shrink-0 border-r border-slate-200 bg-slate-50/50 py-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                tab === id ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>
        <div className="min-w-0 flex-1 overflow-auto max-h-[280px]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50/95 border-b border-slate-200">
              <tr>
                <th className="w-10 px-3 py-2"></th>
                <th className="px-3 py-2 font-semibold text-slate-700">名前</th>
                {(tab === "book" || tab === "slide") && (
                  <th className="px-3 py-2 font-semibold text-slate-700">言語</th>
                )}
                {(tab === "course" || tab === "learningpath") && (
                  <th className="px-3 py-2 font-semibold text-slate-700">想定時間</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const key = `${row.type}-${row.id}`;
                const isSelected = selectedSet.has(key);
                const item: PickedMaterial = { type: row.type, id: row.id, label: row.label };
                return (
                  <tr
                    key={key}
                    className={`border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer ${isSelected ? "bg-blue-50/50" : ""}`}
                    onClick={() => toggle(item)}
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggle(item)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="font-medium text-slate-900">{row.label}</span>
                        {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                      </div>
                    </td>
                    {(tab === "book" || tab === "slide") && (
                      <td className="px-3 py-2 text-slate-600">{row.language ?? "—"}</td>
                    )}
                    {(tab === "course" || tab === "learningpath") && (
                      <td className="px-3 py-2 text-slate-600">{row.estimatedTime ?? "—"}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="p-4 text-center text-sm text-slate-500">該当するマテリアルがありません。フィルターを変えて検索してください。</p>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          選択中: {selected.length} 件 {effectiveMax > 0 && `（最大${effectiveMax}件）`}
        </p>
      )}

      {!courseOnly && (
        <a
          href={`${CM_BASE_URL}/library/${tab}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
        >
          CMを開く <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
