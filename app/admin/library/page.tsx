"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_MATERIALS } from "@/lib/mockData";
import type { Material, MaterialType } from "@/lib/mockData";
import { Search } from "lucide-react";

const typeLabels: Record<MaterialType, string> = {
  video: "動画",
  pdf: "PDF",
  slide: "スライド",
  quiz: "クイズ",
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MaterialType>("all");

  const filtered = useMemo(() => {
    let list = MOCK_MATERIALS;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") list = list.filter((m) => m.type === typeFilter);
    return list;
  }, [search, typeFilter]);

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-slate-900">ライブラリ</h1>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="マテリアルを検索"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">種別:</span>
          {(["all", "video", "pdf", "slide", "quiz"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t === "all" ? "all" : t)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                typeFilter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "すべて" : typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-3 font-semibold text-slate-700">サムネイル</th>
                <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                <th className="px-4 py-3 font-semibold text-slate-700">種別</th>
                <th className="px-4 py-3 font-semibold text-slate-700">サイズ</th>
                <th className="px-4 py-3 font-semibold text-slate-700">時間/ページ</th>
                <th className="px-4 py-3 font-semibold text-slate-700">作成日</th>
                <th className="px-4 py-3 font-semibold text-slate-700">更新日</th>
                <th className="px-4 py-3 font-semibold text-slate-700">紐付コース</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 text-2xl">{m.thumbnail}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{m.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {typeLabels[m.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.size}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {m.duration ?? (m.pages != null ? `${m.pages}ページ` : "—")}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.createdAt}</td>
                  <td className="px-4 py-3 text-slate-600">{m.updatedAt}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {m.courseIds.length} コース
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
