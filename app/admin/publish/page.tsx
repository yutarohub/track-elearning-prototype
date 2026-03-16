"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Upload, X, Search, ChevronDown, ImageIcon, Pencil, Settings } from "lucide-react";
import { CourseCreateWizard } from "@/components/CourseCreateWizard";
import type { CourseWizardResult } from "@/components/CourseCreateWizard";
import { Toggle } from "@/components/ui/Toggle";
import type { PublishedCourse, PublishStatus, PublishTarget } from "@/lib/publishMock";
import {
  MOCK_PUBLISHED_COURSES,
  STATUS_LABEL,
  TARGET_LABEL,
  MOCK_UDEMY_COURSES,
  MOCK_OTHER_TRACK_COURSES,
} from "@/lib/publishMock";

const STATUS_TABS: { id: "all" | PublishStatus; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "published", label: "公開中" },
  { id: "draft", label: "下書き" },
  { id: "archived", label: "非公開（アーカイブ）" },
];

function StatusBadge({ status }: { status: PublishStatus }) {
  const style =
    status === "published"
      ? "bg-blue-100 text-blue-800"
      : status === "draft"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function TargetBadge({ target }: { target: PublishTarget }) {
  const style =
    target === "e-learning"
      ? "bg-blue-100 text-blue-800"
      : target === "live"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {TARGET_LABEL[target]}
    </span>
  );
}

type PublishMode = "standard" | "externalLms" | "otherTrack";

export default function PublishPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | PublishStatus>("all");
  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [drawerCourse, setDrawerCourse] = useState<PublishedCourse | null>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<PublishMode>("standard");

  // Track e-learning では公開管理の対象を「自学習用 eラーニング」と「ライブイベント」に限定
  const [courses, setCourses] = useState<PublishedCourse[]>(
    MOCK_PUBLISHED_COURSES.filter((c) => c.publishTarget !== "training")
  );

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((c) => c.courseName.toLowerCase().includes(q));
    return list;
  }, [courses, statusFilter, search]);

  function showToast(message: string) {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  }

  function setCourseStatus(id: string, status: PublishStatus) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setStatusMenuId(null);
    showToast(status === "published" ? "コースを公開しました" : "下書きに変更しました");
  }

  function handleWizardComplete(data: CourseWizardResult) {
    const newCourse: PublishedCourse = {
      id: String(courses.length + 1),
      courseName: data.courseName,
      status: data.status,
      publishTarget: data.publishTarget as PublishTarget,
      learners: data.status === "published" ? 0 : 0,
      updatedAt: new Date().toISOString().slice(0, 10),
      description: data.description,
      difficulty: data.difficulty,
      recommendedAudience: data.recommendedAudience,
      whatYouLearn: data.whatYouLearn,
      jobRoleId: data.jobRoleId,
      liveType: data.liveType,
      enrollmentLimit: data.enrollmentLimit,
      recommend: data.recommend,
      providerInfo: data.providerInfo,
      providerName: data.providerName,
      providerLogoUrl: data.providerLogoUrl,
      providerCreator: data.providerCreator,
      applyFlow: data.applyFlow,
      applyStartDate: data.applyStartDate,
      applyEndDate: data.applyEndDate,
      isSubscription: data.isSubscription,
      price: data.price,
      applyPeriod: data.applyPeriod,
      tags: data.tags?.length ? data.tags : undefined,
    };
    setCourses((prev) => [newCourse, ...prev]);
    showToast(data.status === "published" ? "コースを公開しました" : "下書きとして保存しました");
  }

  function saveDrawer() {
    if (!drawerCourse) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === drawerCourse.id ? { ...c, ...drawerCourse, updatedAt: new Date().toISOString().slice(0, 10) } : c))
    );
    setDrawerCourse(null);
    showToast("保存しました");
  }

  // Udemy 等外部LMSからのカタログ同期（モック）
  const [udemySynced, setUdemySynced] = useState(false);
  const [udemySelectedIds, setUdemySelectedIds] = useState<string[]>(MOCK_UDEMY_COURSES.map((c) => c.id));

  function syncUdemyCatalogMock() {
    setUdemySynced(true);
    setUdemySelectedIds(MOCK_UDEMY_COURSES.map((c) => c.id));
    showToast("Udemy カタログを同期しました（モック）。下の一覧から公開するコースを確認してください。");
  }

  function publishUdemySelectionMock() {
    if (!udemySynced) {
      syncUdemyCatalogMock();
    }
    setCourses((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const selected = new Set(udemySelectedIds);
      const toAdd = MOCK_UDEMY_COURSES.filter((c) => selected.has(c.id) && !existingIds.has(c.id));
      const mapped = toAdd.map<PublishedCourse>((c) => ({
        ...c,
        status: "published",
        updatedAt: new Date().toISOString().slice(0, 10),
      }));
      return [...mapped, ...prev];
    });
    showToast("選択した Udemy コースを公開しました（モック）");
  }

  return (
    <AppLayout>
      <div className="flex gap-0">
        {/* 左: ステータスナビ（ライブラリと同一の2カラム・デザイン統一） */}
        <aside className="w-52 shrink-0 border-r border-slate-200 bg-white">
          <p className="mb-1 px-3 pt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            ステータス
          </p>
          <nav className="space-y-0.5 px-2 pb-4">
            {STATUS_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatusFilter(id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  statusFilter === id ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 右: メインエリア */}
        <div className="min-w-0 flex-1 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">eラーニング公開管理（自学習＋ライブイベント）</h1>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>設定</span>
            </button>
          </div>

          {/* タブ: Trackコース公開 / 外部LMS取り込み / 他社Track環境取り込み */}
          <div className="mt-4 inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setMode("standard")}
              className={`rounded-full px-4 py-1.5 ${mode === "standard" ? "bg-white text-slate-900 shadow-sm" : ""}`}
            >
              Trackコース公開
            </button>
            <button
              type="button"
              onClick={() => setMode("externalLms")}
              className={`rounded-full px-4 py-1.5 ${mode === "externalLms" ? "bg-white text-slate-900 shadow-sm" : ""}`}
            >
              外部LMS取り込み
            </button>
            <button
              type="button"
              onClick={() => setMode("otherTrack")}
              className={`rounded-full px-4 py-1.5 ${mode === "otherTrack" ? "bg-white text-slate-900 shadow-sm" : ""}`}
            >
              他社Track環境取り込み
            </button>
          </div>

          {mode === "standard" && (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Q 検索"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    aria-label="検索"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setWizardOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  マテリアルから新規公開
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-4 py-3 font-semibold text-slate-700">コース名</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">ステータス</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">公開先</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">受講者数</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">最終更新日</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((c) => (
                      <tr
                        key={c.id}
                        className="cursor-pointer border-b border-slate-100 hover:bg-slate-50/50"
                        onClick={() => {
                          setStatusMenuId(null);
                          setDrawerCourse({ ...c });
                        }}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{c.courseName}</td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setStatusMenuId(statusMenuId === c.id ? null : c.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                            >
                              <StatusBadge status={c.status} />
                              <ChevronDown className="h-3 w-3 text-slate-500" />
                            </button>
                            {statusMenuId === c.id && (
                              <div className="absolute left-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-[fade-in_0.15s_ease-out]">
                                {c.status !== "published" && (
                                  <button
                                    type="button"
                                    onClick={() => setCourseStatus(c.id, "published")}
                                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                  >
                                    公開する
                                  </button>
                                )}
                                {c.status !== "draft" && (
                                  <button
                                    type="button"
                                    onClick={() => setCourseStatus(c.id, "draft")}
                                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                  >
                                    下書きにする
                                  </button>
                                )}
                                {c.status !== "archived" && (
                                  <button
                                    type="button"
                                    onClick={() => setCourseStatus(c.id, "archived")}
                                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                  >
                                    非公開（アーカイブ）
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <TargetBadge target={c.publishTarget} />
                            {c.publishTarget === "live" && (
                              <button
                                type="button"
                                className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700"
                                title={`講師: ${c.instructorName ?? "未設定"} / 次回開催: ${c.nextLiveSchedule ?? "未設定"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                ライブ情報
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{c.learners}</td>
                        <td className="px-4 py-3 text-slate-600">{c.updatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {mode === "externalLms" && (
            <div className="mt-4 space-y-4">
              <div className="space-y-1 text-xs font-medium text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">Step 1: カタログ同期</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Step 2: 公開設定</span>
              </div>
              <div className="space-y-2 rounded-xl border border-violet-200 bg-violet-50/40 p-4">
                <p className="text-sm font-medium text-violet-800">外部LMS取り込み（Udemy 等・モック）</p>
                <p className="text-xs text-slate-600">
                  外部LMSにあるコース情報を一括で同期し、Track e-learning 内に「下書き候補」として保持します。下の一覧から公開するコースだけを選べます。
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium">連携サービス:</span>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-800 shadow-sm">
                    Udemy カタログ（モック）
                  </span>
                </div>
                <button
                  type="button"
                  onClick={syncUdemyCatalogMock}
                  className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700"
                >
                  Udemy カタログを同期（モック）
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-xs font-medium text-slate-700">
                  <span>同期済みコース一覧（プレビュー）</span>
                  <span className="text-[10px] text-slate-500">チェックしたコースのみ公開します</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="w-10 px-3 py-2">
                          <input
                            type="checkbox"
                            checked={udemySelectedIds.length === MOCK_UDEMY_COURSES.length}
                            onChange={(e) =>
                              setUdemySelectedIds(
                                e.target.checked ? MOCK_UDEMY_COURSES.map((c) => c.id) : [],
                              )
                            }
                            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                          />
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">コース名</th>
                        <th className="px-3 py-2 font-semibold text-slate-700">難易度</th>
                        <th className="px-3 py-2 font-semibold text-slate-700">タグ</th>
                        <th className="px-3 py-2 font-semibold text-slate-700">公開先</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_UDEMY_COURSES.map((c) => {
                        const checked = udemySelectedIds.includes(c.id);
                        return (
                          <tr key={c.id} className="border-b border-slate-100">
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  setUdemySelectedIds((prev) =>
                                    e.target.checked
                                      ? [...prev, c.id]
                                      : prev.filter((id) => id !== c.id),
                                  )
                                }
                                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                              />
                            </td>
                            <td className="px-3 py-2 text-slate-900">{c.courseName}</td>
                            <td className="px-3 py-2 text-slate-600">{c.difficulty ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-600">
                              {c.tags?.join(", ") || "-"}
                            </td>
                            <td className="px-3 py-2">
                              <TargetBadge target={c.publishTarget} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-100 px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={publishUdemySelectionMock}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    選択したコースを公開（モック）
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "otherTrack" && (
            <div className="mt-4 space-y-4">
              <div className="space-y-1 text-xs font-medium text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">Step 1: Track 環境を選択</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Step 2: コース取り込み</span>
              </div>
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-sm font-medium text-slate-800">他社Track環境取り込み（モック）</p>
                <p className="text-xs text-slate-600">
                  どの Track 環境からコースを持ってくるかを選び、「カタログを取得」すると下に一覧が表示されます。基本は全選択のまま取り込みできます。
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Track 環境</label>
                    <select className="mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
                      <option value="">選択してください</option>
                      <option value="org-a">Group A Track（Tokyo）</option>
                      <option value="org-b">Group B Track（APAC）</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  カタログを取得（モック）
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-xs font-medium text-slate-700">
                  <span>取得済みコース一覧（プレビュー）</span>
                  <span className="text-[10px] text-slate-500">デフォルトで全選択されています</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="w-10 px-3 py-2">
                          <input
                            type="checkbox"
                            checked={true}
                            readOnly
                            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                          />
                        </th>
                        <th className="px-3 py-2 font-semibold text-slate-700">コース名</th>
                        <th className="px-3 py-2 font-semibold text-slate-700">難易度</th>
                        <th className="px-3 py-2 font-semibold text-slate-700">タグ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_OTHER_TRACK_COURSES.map((c) => (
                        <tr key={c.id} className="border-b border-slate-100">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked
                              readOnly
                              className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                            />
                          </td>
                          <td className="px-3 py-2 text-slate-900">{c.courseName}</td>
                          <td className="px-3 py-2 text-slate-600">{c.difficulty ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-600">{c.tags?.join(", ") || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-100 px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setCourses((prev) => {
                        const existingIds = new Set(prev.map((c) => c.id));
                        const toAdd = MOCK_OTHER_TRACK_COURSES.filter((c) => !existingIds.has(c.id));
                        const mapped = toAdd.map<PublishedCourse>((c) => ({
                          ...c,
                          status: "published",
                          updatedAt: new Date().toISOString().slice(0, 10),
                        }));
                        return [...mapped, ...prev];
                      });
                      showToast("他社Track環境からコースを取り込みました（モック）");
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    選択したコースを取り込む（モック）
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* トースト（画面上部） */}
      {toast && (
        <div
          className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-lg animate-[fade-in_0.2s_ease-out]"
          role="status"
        >
          {toast.message}
        </div>
      )}

      {/* 外部サービスAPI連携設定（サイドパネル） */}
      {settingsOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 animate-[fade-in_0.2s_ease-out]"
            onClick={() => setSettingsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-xl animate-slide-in-right"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 id="settings-title" className="text-lg font-semibold text-slate-900">
                  外部サービスAPI連携（モック）
                </h2>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  aria-label="閉じる"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-6 text-sm">
                <p className="text-xs text-slate-500">
                  Udemy や他LMSとのAPI連携を想定したモック画面です。現在は値を保存するだけで実際の連携は行いません。
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Udemy API Key</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="****************"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Udemy Organization ID</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="org_XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">その他LMS Webhook URL</label>
                  <input
                    type="url"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="https://example.com/webhook"
                  />
                </div>
                <p className="mt-2 text-[10px] text-violet-700">
                  外部サービス連携の操作には、紫系のアクセントカラーを使用して統合LXPとしての一貫した体験を表現します。
                </p>
              </div>
              <div className="border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    showToast("外部サービスAPI連携設定を保存しました（モック）");
                  }}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  設定を保存
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <CourseCreateWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />

      {/* ドロワー編集 */}
      {drawerCourse && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 animate-[fade-in_0.2s_ease-out]"
            onClick={() => setDrawerCourse(null)}
            aria-hidden="true"
          />
          <div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-xl animate-slide-in-right"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 id="drawer-title" className="text-lg font-semibold text-slate-900">
                  コースを編集
                </h2>
                <button
                  type="button"
                  onClick={() => setDrawerCourse(null)}
                  aria-label="閉じる"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-xs text-slate-500">コース名</label>
                  <input
                    type="text"
                    value={drawerCourse.courseName}
                    onChange={(e) => setDrawerCourse((c) => (c ? { ...c, courseName: e.target.value } : null))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">詳細説明</label>
                  <textarea
                    value={drawerCourse.description ?? ""}
                    onChange={(e) => setDrawerCourse((c) => (c ? { ...c, description: e.target.value } : null))}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">ステータス</label>
                  <div className="mt-1 flex gap-2">
                    {(["published", "draft", "archived"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDrawerCourse((c) => (c ? { ...c, status: s } : null))}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          drawerCourse.status === s ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500">公開先（Track e-learning）</label>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    本システムでは、自学習用の eラーニング と ライブイベント のみ公開管理します。
                  </p>
                  <div className="mt-1 flex gap-2">
                    {(["e-learning", "live"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDrawerCourse((c) => (c ? { ...c, publishTarget: t } : null))}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          drawerCourse.publishTarget === t ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {TARGET_LABEL[t]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500">受講制限と申込フロー</label>
                  <div className="mt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDrawerCourse((c) => (c ? { ...c, enrollmentLimit: "public", applyStartDate: undefined, applyEndDate: undefined, isSubscription: false, price: undefined, applyPeriod: undefined } : null))}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${
                        (drawerCourse.enrollmentLimit ?? "public") === "public" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      公開（全員アクセス可能）
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerCourse((c) => (c ? { ...c, enrollmentLimit: "application" } : null))}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${
                        drawerCourse.enrollmentLimit === "application" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      要申込
                    </button>
                  </div>
                  {drawerCourse.enrollmentLimit === "application" && (
                    <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500">開始日</label>
                          <input
                            type="date"
                            value={drawerCourse.applyStartDate ?? ""}
                            onChange={(e) => setDrawerCourse((c) => (c ? { ...c, applyStartDate: e.target.value || undefined } : null))}
                            className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">終了日</label>
                          <input
                            type="date"
                            value={drawerCourse.applyEndDate ?? ""}
                            onChange={(e) => setDrawerCourse((c) => (c ? { ...c, applyEndDate: e.target.value || undefined } : null))}
                            className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={drawerCourse.isSubscription ?? false}
                          onChange={(e) => setDrawerCourse((c) => (c ? { ...c, isSubscription: e.target.checked } : null))}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                        />
                        <span className="text-xs text-slate-700">サブスクにする</span>
                      </label>
                      <div>
                        <label className="block text-[10px] text-slate-500">本数 (¥)</label>
                        <input
                          type="text"
                          value={drawerCourse.price ?? ""}
                          onChange={(e) => setDrawerCourse((c) => (c ? { ...c, price: e.target.value || undefined } : null))}
                          placeholder="¥"
                          className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">説明</label>
                        <textarea
                          value={drawerCourse.applyPeriod ?? ""}
                          onChange={(e) => setDrawerCourse((c) => (c ? { ...c, applyPeriod: e.target.value || undefined } : null))}
                          placeholder="申込に関する説明"
                          rows={2}
                          className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  <span className="text-sm text-slate-700">おすすめにする</span>
                  <Toggle
                    checked={drawerCourse.recommend ?? false}
                    onChange={(v) => setDrawerCourse((c) => (c ? { ...c, recommend: v } : null))}
                    aria-label="おすすめにする"
                  />
                </label>
                <div className="rounded-lg border border-slate-200 px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">提供者情報を表示</span>
                    <Toggle
                      checked={drawerCourse.providerInfo ?? false}
                      onChange={(v) => setDrawerCourse((c) => (c ? { ...c, providerInfo: v } : null))}
                      aria-label="提供者情報を表示"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">受講者のeラーニングページに、提供者としての管理者情報を表示します。</p>
                  {(drawerCourse.providerInfo ?? false) && (
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600">組織名（名称）</label>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={drawerCourse.providerName ?? ""}
                            onChange={(e) => setDrawerCourse((c) => (c ? { ...c, providerName: e.target.value || undefined } : null))}
                            placeholder="例: 株式会社〇〇"
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                          <Pencil className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600">ロゴ画像</label>
                        <p className="mt-0.5 text-[10px] text-slate-500">推奨: 16:9 または正方形。jpg, png, gif</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            {drawerCourse.providerLogoUrl ? (
                              <img src={drawerCourse.providerLogoUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <input
                              type="url"
                              value={drawerCourse.providerLogoUrl ?? ""}
                              onChange={(e) => setDrawerCourse((c) => (c ? { ...c, providerLogoUrl: e.target.value || undefined } : null))}
                              placeholder="画像URL"
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                          </div>
                          <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="ロゴを編集">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600">作成者</label>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={drawerCourse.providerCreator ?? ""}
                            onChange={(e) => setDrawerCourse((c) => (c ? { ...c, providerCreator: e.target.value || undefined } : null))}
                            placeholder="例: 山田 太郎"
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                          <Pencil className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={saveDrawer}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  保存して閉じる
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
