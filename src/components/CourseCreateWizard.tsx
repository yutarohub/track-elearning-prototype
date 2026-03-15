"use client";

import { useState } from "react";
import { Upload, X, ChevronRight, Check, ImageIcon, Pencil } from "lucide-react";
import { MaterialPicker } from "@/components/MaterialPicker";
import type { PickedMaterial } from "@/components/MaterialPicker";
import { MOCK_JOB_ROLES } from "@/lib/jobRolesMock";
import { COURSE_TAG_OPTIONS } from "@/lib/courseTags";
import { Toggle } from "@/components/ui/Toggle";

/** ウィザード完了時に親に渡すデータ（eラーニング公開・ライブラリのどちらでも利用） */
export interface CourseWizardResult {
  courseName: string;
  status: "published" | "draft";
  publishTarget: "e-learning" | "training" | "live";
  description?: string;
  difficulty?: string;
  recommendedAudience?: string;
  whatYouLearn?: string;
  jobRoleId?: string;
  liveType?: "online" | "offline";
  enrollmentLimit: "public" | "application";
  recommend: boolean;
  providerInfo: boolean;
  providerName?: string;
  providerLogoUrl?: string;
  providerCreator?: string;
  applyFlow: "immediate" | "approval";
  applyStartDate?: string;
  applyEndDate?: string;
  isSubscription: boolean;
  price?: string;
  applyPeriod?: string;
  tags: string[];
}

export interface CourseCreateWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: CourseWizardResult) => void;
  /** ウィザードのタイトル（省略時は「ワンストップ公開ウィザード」） */
  title?: string;
}

const INITIAL_FORM = {
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
  providerName: "",
  providerLogoUrl: "",
  providerCreator: "",
  applyFlow: "immediate" as "immediate" | "approval",
  applyStartDate: "",
  applyEndDate: "",
  isSubscription: false,
  price: "",
  applyPeriod: "",
  finalStatus: "" as "publish" | "draft" | "",
  tags: [] as string[],
};

export function CourseCreateWizard({
  open,
  onClose,
  onComplete,
  title = "ワンストップ公開ウィザード",
}: CourseCreateWizardProps) {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardForm, setWizardForm] = useState(INITIAL_FORM);

  function handleClose() {
    setWizardForm(INITIAL_FORM);
    setWizardStep(1);
    onClose();
  }

  function finishWizard() {
    const courseName =
      wizardForm.flowMode === "existing_course" && wizardForm.selectedExistingCourse
        ? wizardForm.selectedExistingCourse.label
        : wizardForm.title || "新規コース";
    const result: CourseWizardResult = {
      courseName,
      status: wizardForm.finalStatus === "publish" ? "published" : "draft",
      publishTarget: (wizardForm.target || "e-learning") as "e-learning" | "training" | "live",
      description: wizardForm.description || undefined,
      difficulty: wizardForm.difficulty || undefined,
      recommendedAudience: wizardForm.recommendedAudience || undefined,
      whatYouLearn: wizardForm.whatYouLearn || undefined,
      jobRoleId: wizardForm.jobRoleId || undefined,
      liveType: (wizardForm.liveType || undefined) as "online" | "offline" | undefined,
      enrollmentLimit: wizardForm.enrollmentLimit,
      recommend: wizardForm.recommend,
      providerInfo: wizardForm.providerInfo,
      providerName: wizardForm.providerName || undefined,
      providerLogoUrl: wizardForm.providerLogoUrl || undefined,
      providerCreator: wizardForm.providerCreator || undefined,
      applyFlow: wizardForm.applyFlow,
      applyStartDate: wizardForm.applyStartDate || undefined,
      applyEndDate: wizardForm.applyEndDate || undefined,
      isSubscription: wizardForm.isSubscription,
      price: wizardForm.price || undefined,
      applyPeriod: wizardForm.applyPeriod || undefined,
      tags: wizardForm.tags?.length ? [...wizardForm.tags] : [],
    };
    onComplete(result);
    handleClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-[fade-in_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-create-wizard-title"
    >
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl animate-[fade-in_0.2s_ease-out]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="course-create-wizard-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
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
          {/* Step 1 */}
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

          {/* Step 2 */}
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
                <label className="block text-xs text-slate-500">タグ</label>
                <p className="mt-0.5 text-[10px] text-slate-500">ライブラリのタグフィルターで検索できます。複数選択可能です。</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COURSE_TAG_OPTIONS.map((tag) => {
                    const selected = wizardForm.tags?.includes(tag) ?? false;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setWizardForm((f) => ({
                            ...f,
                            tags: selected ? (f.tags ?? []).filter((t) => t !== tag) : [...(f.tags ?? []), tag],
                          }));
                        }}
                        className={`rounded-full px-3 py-1.5 text-sm transition ${
                          selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
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

          {/* Step 3 */}
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
                <Toggle
                  checked={wizardForm.recommend}
                  onChange={(v) => setWizardForm((f) => ({ ...f, recommend: v }))}
                  aria-label="おすすめにする"
                />
              </label>
              <p className="text-[10px] text-slate-500">おすすめセクションに表示し、メンバーが探しやすくします。</p>

              <div className="rounded-lg border border-slate-200 px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">提供者情報を表示</span>
                  <Toggle
                    checked={wizardForm.providerInfo}
                    onChange={(v) => setWizardForm((f) => ({ ...f, providerInfo: v }))}
                    aria-label="提供者情報を表示"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">受講者のeラーニングページに、提供者としての管理者情報を表示します。</p>
                {wizardForm.providerInfo && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">組織名（名称）</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={wizardForm.providerName ?? ""}
                          onChange={(e) => setWizardForm((f) => ({ ...f, providerName: e.target.value }))}
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
                          {wizardForm.providerLogoUrl ? (
                            <img src={wizardForm.providerLogoUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <input
                            type="url"
                            value={wizardForm.providerLogoUrl ?? ""}
                            onChange={(e) => setWizardForm((f) => ({ ...f, providerLogoUrl: e.target.value }))}
                            placeholder="画像URL または アップロード"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                          <p className="mt-0.5 text-[10px] text-slate-400">URLを入力するか、アップロードは準備中です</p>
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
                          value={wizardForm.providerCreator ?? ""}
                          onChange={(e) => setWizardForm((f) => ({ ...f, providerCreator: e.target.value }))}
                          placeholder="例: 山田 太郎"
                          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                        <Pencil className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
  );
}
