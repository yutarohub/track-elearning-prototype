"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_BADGES } from "@/lib/mockData";
import type { Badge } from "@/lib/mockData";
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

const PRESET_ICONS = ["🏆", "🎯", "🤖", "⚡", "📊", "🔮", "🌟", "💎", "🚀", "🎓"];

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [form, setForm] = useState<Omit<Badge, "id">>({
    name: "",
    description: "",
    color: "#6366f1",
    icon: "🏆",
    courseIds: [],
    issued: 0,
  });

  function openCreate() {
    setForm({
      name: "",
      description: "",
      color: "#6366f1",
      icon: "🏆",
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
      courseIds: badge.courseIds,
      issued: badge.issued,
      expires: badge.expires,
    });
    setModalOpen("edit");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        <h1 className="text-2xl font-bold text-slate-900">バッジ一覧</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-medium text-white shadow-lg transition hover:from-indigo-500 hover:to-violet-500"
        >
          <Plus className="h-5 w-5" />
          バッジを作成
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-lg"
          >
            {/* Accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${badge.color}, ${badge.color}99)` }}
            />

            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon with ring */}
                <div
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner ring-2 ring-white"
                  style={{
                    background: `linear-gradient(135deg, ${badge.color}30, ${badge.color}15)`,
                    boxShadow: `0 0 0 2px ${badge.color}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  }}
                >
                  {badge.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="font-bold tracking-tight text-slate-900"
                    style={{ color: badge.color }}
                  >
                    {badge.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {badge.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      <Award className="mr-1 h-3 w-3" />
                      発行 {badge.issued}
                    </span>
                    <span className="text-xs text-slate-400">
                      コース {badge.courseIds.length} 件
                    </span>
                    {badge.expires != null && (
                      <span className="text-xs text-amber-600">
                        有効期限 {badge.expires}
                      </span>
                    )}
                  </div>
                </div>
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 id="badge-modal-title" className="text-lg font-semibold text-slate-900">
                {modalOpen === "create" ? "バッジを作成" : "バッジを編集"}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  バッジ名
                </label>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  説明
                </label>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  カラー
                </label>
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
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  アイコン（絵文字）
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, icon }))}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                        form.icon === icon
                          ? "ring-2 ring-indigo-500 bg-indigo-50"
                          : "bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value || "🏆" }))}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="絵文字を入力"
                  maxLength={2}
                />
              </div>
              {modalOpen === "edit" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    発行数
                  </label>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  有効期限（任意）
                </label>
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
