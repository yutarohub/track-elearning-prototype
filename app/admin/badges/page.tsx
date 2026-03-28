"use client";

import { useState } from "react";
import Image from "next/image";
import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_BADGES } from "@/lib/mockData";
import type { Badge } from "@/lib/mockData";
import { PRESET_BADGE_IMAGES } from "@/lib/badgePresets";
import { OpenBadgeImage } from "@/components/badges/OpenBadgeImage";
import { Plus, Pencil, X, Award } from "lucide-react";

const PRESET_COLORS = [
  { value: "#6366f1", label: "インディゴ" },
  { value: "#8b5cf6", label: "バイオレット" },
  { value: "#0ea5e9", label: "スカイ" },
  { value: "#10b981", label: "エメラルド" },
  { value: "#eab308", label: "アンバー" },
  { value: "#ec4899", label: "ピンク" },
  { value: "#ef4444", label: "ローズ" },
];

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [form, setForm] = useState<Omit<Badge, "id">>({
    name: "",
    description: "",
    color: "#6366f1",
    icon: "",
    imageSrc: undefined,
    courseIds: [],
    issued: 0,
  });

  function openCreate() {
    setForm({
      name: "",
      description: "",
      color: "#6366f1",
      icon: "",
      imageSrc: PRESET_BADGE_IMAGES[0]?.src,
      courseIds: [],
      issued: 0,
    });
    setEditingBadge(null);
    setModalOpen("create");
  }

  function openEdit(badge: Badge) {
    setEditingBadge(badge);
    setForm({
      name: badge.name,
      description: badge.description,
      color: badge.color,
      icon: badge.icon,
      imageSrc: badge.imageSrc,
      courseIds: badge.courseIds,
      issued: badge.issued,
      expires: badge.expires,
    });
    setModalOpen("edit");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageSrc?.trim()) {
      return;
    }
    if (modalOpen === "create") {
      const newId = Math.max(0, ...badges.map((b) => b.id)) + 1;
      setBadges((prev) => [...prev, { ...form, id: newId }]);
    } else if (editingBadge) {
      setBadges((prev) =>
        prev.map((b) => (b.id === editingBadge.id ? { ...form, id: b.id } : b))
      );
    }
    setModalOpen(null);
    setEditingBadge(null);
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">バッジ管理</h1>
          <p className="mt-1 text-sm text-slate-600">
            オープンバッジ形式の画像を表示します（<code className="rounded bg-slate-100 px-1 text-xs">public/badges</code>
            ）。
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-medium text-white shadow-lg transition hover:from-indigo-500 hover:to-violet-500"
        >
          <Plus className="h-5 w-5" />
          バッジを追加
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-lg"
          >
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${badge.color}, ${badge.color}99)` }}
            />

            <div className="flex flex-col items-center border-b border-slate-100 bg-gradient-to-b from-slate-50/90 to-white px-5 pb-5 pt-6">
              <OpenBadgeImage imageSrc={badge.imageSrc} size="card" />
              <h3
                className="mt-4 text-center text-lg font-bold tracking-tight"
                style={{ color: badge.color }}
              >
                {badge.name}
              </h3>
            </div>

            <div className="p-5">
              <p className="line-clamp-3 text-center text-sm text-slate-600">{badge.description}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  <Award className="mr-1 h-3 w-3" />
                  発行 {badge.issued}
                </span>
                <span className="text-xs text-slate-400">コース {badge.courseIds.length} 件</span>
                {badge.expires != null && (
                  <span className="text-xs text-amber-600">有効期限 {badge.expires}</span>
                )}
              </div>

              <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => openEdit(badge)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" />
                  編集
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 id="badge-modal-title" className="text-lg font-semibold text-slate-900">
                {modalOpen === "create" ? "バッジを追加" : "バッジを編集"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(null)}
                aria-label="閉じる"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  プレビュー
                </p>
                <div className="mt-3 flex justify-center">
                  <OpenBadgeImage imageSrc={form.imageSrc} size="modal" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  バッジ画像
                </label>
                <p className="mb-2 text-xs text-slate-500">プリセットから選ぶか、下の欄にパスを直接入力します。</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {PRESET_BADGE_IMAGES.map((p) => (
                    <button
                      key={p.src}
                      type="button"
                      title={p.label}
                      onClick={() => setForm((f) => ({ ...f, imageSrc: p.src }))}
                      className={`relative flex aspect-square items-center justify-center rounded-xl border-2 bg-white p-1 transition hover:border-indigo-400 ${
                        form.imageSrc === p.src ? "border-indigo-600 ring-2 ring-indigo-200" : "border-slate-200"
                      }`}
                    >
                      <Image src={p.src} alt="" width={48} height={48} className="object-contain" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.imageSrc ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      imageSrc: e.target.value.trim() || undefined,
                    }))
                  }
                  className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm text-slate-900"
                  placeholder="/badges/badge-1-chatgpt-master.png"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">バッジ名</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="例: ChatGPT マスター"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">説明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="バッジの説明を入力"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">アクセントカラー</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                      className={`h-8 w-8 rounded-full border-2 transition ${
                        form.color === c.value ? "border-slate-900 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm text-slate-900"
                  placeholder="#6366f1"
                />
              </div>

              {modalOpen === "edit" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">発行数</label>
                  <input
                    type="number"
                    min={0}
                    value={form.issued}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, issued: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">有効期限（任意）</label>
                <input
                  type="text"
                  value={form.expires ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expires: e.target.value || undefined }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="例: 2025-12-31"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-violet-500"
                >
                  {modalOpen === "create" ? "作成する" : "保存する"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
