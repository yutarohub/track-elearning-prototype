"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Plus,
  Upload,
  X,
  ChevronRight,
  Check,
  Search,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import { MaterialPicker } from "@/components/MaterialPicker";
import type { PickedMaterial } from "@/components/MaterialPicker";
import type { PublishedCourse, PublishStatus, PublishTarget } from "@/lib/publishMock";
import {
  MOCK_PUBLISHED_COURSES,
  STATUS_LABEL,
  TARGET_LABEL,
} from "@/lib/publishMock";
import { MOCK_JOB_ROLES } from "@/lib/jobRolesMock";

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

export default function PublishPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | PublishStatus>("all");
  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [drawerCourse, setDrawerCourse] = useState<PublishedCourse | null>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);

  const [courses, setCourses] = useState<PublishedCourse[]>(MOCK_PUBLISHED_COURSES);

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

  const [wizardForm, setWizardForm] = useState({
    flowMode: "from_materials" as "existing_course" | "from_materials",
    selectedExistingCourse: null as PickedMaterial | null,
    materialType: "library" as "video" | "file" | "library",
    uploadProgress: 0 as number,
    selectedMaterials: [] as PickedMaterial[],
    title: "",
    description: "",
    difficulty: "",
    jobRoleId: "",
    recommendedAudience: "",
    whatYouLearn: "",
    target: "" as "e-learning" | "training" | "live" | "",
    liveType: "" as "online" | "offline" | "",
    enrollmentLimit: "public" as "public" | "application",
    recommend: false,
    providerInfo: false,
    applyFlow: "immediate" as "immediate" | "approval",
    applyStartDate: "",
    applyEndDate: "",
    isSubscription: false,
    price: "",
    applyPeriod: "",
    finalStatus: "" as "publish" | "draft" | "",
  });

  function openWizard() {
    setWizardForm({
      flowMode: "from_materials",
      selectedExistingCourse: null,
      materialType: "library",
      uploadProgress: 0,
      selectedMaterials: [],
      title: "",
      description: "",
      difficulty: "",
      jobRoleId: "",
      recommendedAudience: "",
      whatYouLearn: "",
      target: "",
      liveType: "",
      enrollmentLimit: "public",
      recommend: false,
      providerInfo: false,
      applyFlow: "immediate",
      applyStartDate: "",
      applyEndDate: "",
      isSubscription: false,
      price: "",
      applyPeriod: "",
      finalStatus: "",
    });
    setWizardStep(1);
    setWizardOpen(true);
  }

  function finishWizard() {
    const courseName =
      wizardForm.flowMode === "existing_course" && wizardForm.selectedExistingCourse
        ? wizardForm.selectedExistingCourse.label
        : wizardForm.title || "新規コース";
    const newCourse: PublishedCourse = {
      id: String(courses.length + 1),
      courseName,
      status: wizardForm.finalStatus === "publish" ? "published" : "draft",
      publishTarget: (wizardForm.target || "e-learning") as PublishTarget,
      learners: wizardForm.finalStatus === "publish" ? 0 : 0,
      updatedAt: new Date().toISOString().slice(0, 10),
      description: wizardForm.description || undefined,
      difficulty: wizardForm.difficulty || undefined,
      recommendedAudience: wizardForm.recommendedAudience || undefined,
      whatYouLearn: wizardForm.whatYouLearn || undefined,
      jobRoleId: wizardForm.jobRoleId || undefined,
      liveType: wizardForm.liveType || undefined,
      enrollmentLimit: wizardForm.enrollmentLimit,
      recommend: wizardForm.recommend,
      providerInfo: wizardForm.providerInfo,
      applyFlow: wizardForm.applyFlow,
      applyStartDate: wizardForm.applyStartDate || undefined,
      applyEndDate: wizardForm.applyEndDate || undefined,
      isSubscription: wizardForm.isSubscription,
      price: wizardForm.price || undefined,
      applyPeriod: wizardForm.applyPeriod || undefined,
    };
    setCourses((prev) => [newCourse, ...prev]);
    setWizardOpen(false);
    setWizardStep(1);
    showToast(wizardForm.finalStatus === "publish" ? "コースを公開しました" : "下書きとして保存しました");
  }

  function saveDrawer() {
    if (!drawerCourse) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === drawerCourse.id ? { ...c, ...drawerCourse, updatedAt: new Date().toISOString().slice(0, 10) } : c))
    );
    setDrawerCourse(null);
    showToast("保存しました");
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

        {/* 右: メイン一覧 */}
        <div className="min-w-0 flex-1 p-6">
          <h1 className="text-2xl font-bold text-slate-900">eラーニング・集合研修 公開管理</h1>

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
              onClick={openWizard}
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
                    className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => { setStatusMenuId(null); setDrawerCourse({ ...c }); }}
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
                      <TargetBadge target={c.publishTarget} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.learners}</td>
                    <td className="px-4 py-3 text-slate-600">{c.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* ワンストップ・ウィザード */}
      {wizardOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-[fade-in_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
        >
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl animate-[fade-in_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 id="wizard-title" className="text-lg font-semibold text-slate-900">
                ワンストップ公開ウィザード
              </h2>
              <button
                type="button"
                onClick={() => { setWizardOpen(false); setWizardStep(1); }}
                aria-label="閉じる"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex border-b border-slate-200">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex flex-1 items-center justify-center gap-1 py-3 text-sm ${
                    wizardStep >= s ? "text-indigo-600 font-medium" : "text-slate-400"
                  }`}
                >
                  {wizardStep > s ? <Check className="h-4 w-4" /> : null}
                  <span>ステップ{s}</span>
                  {s < 3 && <ChevronRight className="h-4 w-4" />}
                </div>
              ))}
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-6">
              {/* Step 1: 既存コース紐づけ or マテリアルから作成（コース・学習パスも選択可） */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-[fade-in_0.25s_ease-out]">
                  <p className="text-sm font-medium text-slate-700">進め方を選んでください</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setWizardForm((f) => ({ ...f, flowMode: "existing_course", selectedExistingCourse: null }))}
                      className={`flex-1 rounded-lg border px-4 py-3 text-left text-sm ${
                        wizardForm.flowMode === "existing_course" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium">既存コースを紐づけて eラーニング化</span>
                      <p className="mt-0.5 text-xs opacity-90">既存コース・学習パスを選び、eラーニング/集合研修用の講座として公開します。</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardForm((f) => ({ ...f, flowMode: "from_materials" }))}
                      className={`flex-1 rounded-lg border px-4 py-3 text-left text-sm ${
                        wizardForm.flowMode === "from_materials" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium">マテリアルから新規作成</span>
                      <p className="mt-0.5 text-xs opacity-90">ライブラリのマテリアル・コース・学習パスを選ぶか、動画・ファイルをアップロードします。</p>
                    </button>
                  </div>
                  {wizardForm.flowMode === "existing_course" && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-slate-500">コースまたは学習パスを1件選択してください。</p>
                      <MaterialPicker
                        selected={wizardForm.selectedExistingCourse ? [wizardForm.selectedExistingCourse] : []}
                        onSelectionChange={(selected) => setWizardForm((f) => ({ ...f, selectedExistingCourse: selected[0] ?? null }))}
                        courseOnly
                        className="mt-2"
                      />
                    </div>
                  )}
                  {wizardForm.flowMode === "from_materials" && (
                    <>
                      <div className="flex gap-2">
                        {(["library", "video", "file"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setWizardForm((f) => ({ ...f, materialType: t }))}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              wizardForm.materialType === t ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {t === "library" ? "ライブラリから選択" : t === "video" ? "動画をアップロード" : "ファイルをアップロード"}
                          </button>
                        ))}
                      </div>
                      {wizardForm.materialType === "library" && (
                        <MaterialPicker
                          selected={wizardForm.selectedMaterials}
                          onSelectionChange={(selected) => setWizardForm((f) => ({ ...f, selectedMaterials: selected }))}
                          className="mt-2"
                        />
                      )}
                      {(wizardForm.materialType === "video" || wizardForm.materialType === "file") && (
                        <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                        >
                          <Upload className="mx-auto h-10 w-10 text-slate-400" />
                          <p className="mt-2 text-center text-sm text-slate-600">ドラッグ＆ドロップ、またはクリックして選択</p>
                          <p className="mt-1 text-center text-xs text-slate-500">アップロード中も次へ進めます</p>
                          {wizardForm.uploadProgress > 0 && wizardForm.uploadProgress < 100 && (
                            <div className="mx-auto mt-3 w-48 rounded-full bg-slate-200">
                              <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${wizardForm.uploadProgress}%` }} />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Step 2: タイトル・詳細説明・画像・想定受講者（参考: コースを公開フォーム） */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-[fade-in_0.25s_ease-out]">
                  <p className="text-sm font-medium text-slate-700">タイトルと詳細説明</p>
                  <div>
                    <label className="block text-xs text-slate-500">タイトル</label>
                    <input
                      type="text"
                      value={wizardForm.title}
                      onChange={(e) => setWizardForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="例: ChatGPT 基礎"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">詳細説明</label>
                    <textarea
                      value={wizardForm.description}
                      onChange={(e) => setWizardForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="コースの概要を入力。受講者が内容を判断できるように記載してください。"
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">太字・リンクなどは公開後に編集できます。</p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">コース画像</label>
                    <p className="mt-0.5 text-[10px] text-slate-500">サムネイル・ヘッダー画像として利用されます。</p>
                    <div className="mt-2 flex aspect-video max-w-md items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
                        <p className="mt-1 text-xs text-slate-500">16:9推奨（750×422px）</p>
                        <p className="text-[10px] text-slate-400">jpeg, jpg, gif, png</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">想定受講者（スキル可視化プラットフォーム連動）</label>
                    <p className="mt-0.5 text-[10px] text-slate-500">職種は別システムで定義されている86職種のJDと連動します。受講者がキャリア目的でコースを探しやすくします。</p>
                    <div className="mt-2 space-y-2">
                      <select
                        value={wizardForm.jobRoleId}
                        onChange={(e) => setWizardForm((f) => ({ ...f, jobRoleId: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <option value="">職種を選択</option>
                        {MOCK_JOB_ROLES.map((jr) => (
                          <option key={jr.id} value={jr.id}>{jr.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={wizardForm.recommendedAudience}
                        onChange={(e) => setWizardForm((f) => ({ ...f, recommendedAudience: e.target.value }))}
                        placeholder="想定受講者等（職種以外の補足）"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                      <select
                        value={wizardForm.difficulty}
                        onChange={(e) => setWizardForm((f) => ({ ...f, difficulty: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <option value="">難易度を選択</option>
                        <option value="入門">入門</option>
                        <option value="初級">初級</option>
                        <option value="中級">中級</option>
                        <option value="上級">上級</option>
                      </select>
                      <textarea
                        value={wizardForm.whatYouLearn}
                        onChange={(e) => setWizardForm((f) => ({ ...f, whatYouLearn: e.target.value }))}
                        placeholder="このコースで学べること"
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">ターゲットと形式</label>
                    <p className="mt-0.5 text-[10px] text-slate-500">本システムでは自学習用のみ選択可能です。自学習用を選ぶと、eラーニング または ライブイベント を選択できます。</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setWizardForm((f) => ({ ...f, target: "e-learning", liveType: "" }))}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          (wizardForm.target === "e-learning" || wizardForm.target === "live") ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        自学習用
                      </button>
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-400"
                        title="本システムでは利用できません"
                      >
                        集合研修用（利用不可）
                      </button>
                    </div>
                    {(wizardForm.target === "e-learning" || wizardForm.target === "live") && (
                      <div className="mt-3">
                        <span className="block text-xs text-slate-500">形式（自学習用）</span>
                        <div className="mt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setWizardForm((f) => ({ ...f, target: "e-learning", liveType: "" }))}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              wizardForm.target === "e-learning" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            eラーニング
                          </button>
                          <button
                            type="button"
                            onClick={() => setWizardForm((f) => ({ ...f, target: "live" }))}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              wizardForm.target === "live" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            ライブイベント
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {wizardForm.target === "live" && (
                    <div className="mt-3 space-y-2 animate-[fade-in_0.25s_ease-out]">
                      <label className="block text-xs text-slate-500">実施形式</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setWizardForm((f) => ({ ...f, liveType: "online" }))}
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            wizardForm.liveType === "online" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          オンライン (Zoom等)
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizardForm((f) => ({ ...f, liveType: "offline" }))}
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            wizardForm.liveType === "offline" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          オフライン (会場)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: 公開設定・受講制限と申込フロー・公開/下書き（参考画像に合わせる） */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-[fade-in_0.25s_ease-out]">
                  <p className="text-sm font-medium text-slate-700">公開設定</p>
                  <div>
                    <label className="block text-xs text-slate-500">受講制限と申込フロー</label>
                    <p className="mt-0.5 text-[10px] text-slate-500">受講者がコースの参加を申し込みます。即時受講か事前申込を選んでください。</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWizardForm((f) => ({ ...f, enrollmentLimit: "public", applyFlow: "immediate", applyStartDate: "", applyEndDate: "", isSubscription: false, price: "", applyPeriod: "" }))}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                          wizardForm.enrollmentLimit === "public" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        公開（全員アクセス可能）
                      </button>
                      <button
                        type="button"
                        onClick={() => setWizardForm((f) => ({ ...f, enrollmentLimit: "application", applyFlow: "approval" }))}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                          wizardForm.enrollmentLimit === "application" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        要申込
                      </button>
                    </div>
                    {wizardForm.enrollmentLimit === "application" && (
                      <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 animate-[fade-in_0.25s_ease-out]">
                        <p className="text-xs font-medium text-slate-600">申込情報（要申込の場合）</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-500">開始日（必須）</label>
                            <input
                              type="date"
                              value={wizardForm.applyStartDate}
                              onChange={(e) => setWizardForm((f) => ({ ...f, applyStartDate: e.target.value }))}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500">終了日（必須）</label>
                            <input
                              type="date"
                              value={wizardForm.applyEndDate}
                              onChange={(e) => setWizardForm((f) => ({ ...f, applyEndDate: e.target.value }))}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={wizardForm.isSubscription}
                            onChange={(e) => setWizardForm((f) => ({ ...f, isSubscription: e.target.checked }))}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-slate-700">サブスクにする</span>
                        </label>
                        <div>
                          <label className="block text-xs text-slate-500">本数 (¥)</label>
                          <input
                            type="text"
                            value={wizardForm.price}
                            onChange={(e) => setWizardForm((f) => ({ ...f, price: e.target.value }))}
                            placeholder="¥"
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500">説明</label>
                          <textarea
                            value={wizardForm.applyPeriod}
                            onChange={(e) => setWizardForm((f) => ({ ...f, applyPeriod: e.target.value }))}
                            placeholder="申込に関する説明"
                            rows={2}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                    <span className="text-sm text-slate-700">おすすめにする</span>
                    <input
                      type="checkbox"
                      checked={wizardForm.recommend}
                      onChange={(e) => setWizardForm((f) => ({ ...f, recommend: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <p className="text-[10px] text-slate-500">おすすめセクションに表示し、メンバーが探しやすくします。</p>
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                    <span className="text-sm text-slate-700">提供者情報を表示</span>
                    <input
                      type="checkbox"
                      checked={wizardForm.providerInfo}
                      onChange={(e) => setWizardForm((f) => ({ ...f, providerInfo: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <p className="text-[10px] text-slate-500">受講者向け詳細ページに提供者・作成者を表示します。</p>

                  <hr className="border-slate-200" />
                  <p className="text-sm font-medium text-slate-700">公開・下書きの最終決定</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWizardForm((f) => ({ ...f, finalStatus: "publish" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                        wizardForm.finalStatus === "publish" ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      今すぐ公開
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardForm((f) => ({ ...f, finalStatus: "draft" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                        wizardForm.finalStatus === "draft" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      下書きとして保存
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                戻る
              </button>
              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((s) => s + 1)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  次へ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishWizard}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {wizardForm.finalStatus === "publish" ? "公開する" : "下書き保存"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
                  <label className="block text-xs text-slate-500">公開先</label>
                  <div className="mt-1 flex gap-2">
                    {(["e-learning", "live", "training"] as const).map((t) => (
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
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">おすすめにする</span>
                  <input
                    type="checkbox"
                    checked={drawerCourse.recommend ?? false}
                    onChange={(e) => setDrawerCourse((c) => (c ? { ...c, recommend: e.target.checked } : null))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">提供者情報を表示</span>
                  <input
                    type="checkbox"
                    checked={drawerCourse.providerInfo ?? false}
                    onChange={(e) => setDrawerCourse((c) => (c ? { ...c, providerInfo: e.target.checked } : null))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                </label>
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
