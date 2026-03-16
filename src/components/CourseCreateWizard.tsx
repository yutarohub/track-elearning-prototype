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
   /** 推奨受講職種（複数） */
  jobRoleIds?: string[];
  liveType?: "online" | "offline";
  enrollmentLimit: "public" | "application";
  recommend: boolean;
  providerInfo: boolean;
  providerName?: string;
  providerLogoUrl?: string;
  providerCreator?: string;
  /** 講師情報（ライブ・外部連携向け） */
  instructorName?: string;
  instructorAvatarUrl?: string;
  instructorBio?: string;
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

const JOB_FAMILIES: { id: string; name: string; roleIds: string[] }[] = [
  { id: "eng", name: "エンジニアリング", roleIds: ["jr-01", "jr-02", "jr-03", "jr-04", "jr-08", "jr-09", "jr-10"] },
  { id: "pm", name: "プロダクト・プロジェクト", roleIds: ["jr-05", "jr-06", "jr-11", "jr-12"] },
  { id: "gtm", name: "営業・カスタマーサクセス", roleIds: ["jr-13", "jr-14"] },
  { id: "hr", name: "人事・バックオフィス", roleIds: ["jr-15", "jr-16", "jr-17"] },
  { id: "other", name: "その他・共通", roleIds: ["jr-18", "jr-19", "jr-20"] },
];

const INITIAL_FORM = {
  flowMode: "from_materials" as "existing_course" | "from_materials" | "from_external" | "from_other_org",
  selectedExistingCourse: null as PickedMaterial | null,
  materialType: "library" as "video" | "file" | "library",
  uploadProgress: 0 as number,
  selectedMaterials: [] as PickedMaterial[],
  title: "",
  description: "",
  difficulty: "",
  jobRoleId: "",
  jobRoleIds: [] as string[],
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
  instructorName: "",
  instructorAvatarUrl: "",
  instructorBio: "",
  liveSchedules: [] as {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    mode: "online" | "offline";
    onlineUrl?: string;
    venue?: string;
    materialNote?: string;
  }[],
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
  const [selectedJobFamilyId, setSelectedJobFamilyId] = useState<string>(JOB_FAMILIES[0]?.id ?? "");
  const [jobSearch, setJobSearch] = useState("");

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
      jobRoleId: wizardForm.jobRoleId || wizardForm.jobRoleIds[0] || undefined,
      jobRoleIds: wizardForm.jobRoleIds.length ? [...wizardForm.jobRoleIds] : undefined,
      liveType: (wizardForm.liveType || undefined) as "online" | "offline" | undefined,
      enrollmentLimit: wizardForm.enrollmentLimit,
      recommend: wizardForm.recommend,
      providerInfo: wizardForm.providerInfo,
      providerName: wizardForm.providerName || undefined,
      providerLogoUrl: wizardForm.providerLogoUrl || undefined,
      providerCreator: wizardForm.providerCreator || undefined,
      instructorName: wizardForm.instructorName || undefined,
      instructorAvatarUrl: wizardForm.instructorAvatarUrl || undefined,
      instructorBio: wizardForm.instructorBio || undefined,
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
              <div className="grid gap-3 md:grid-cols-2">
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
                    <div
                      className="mt-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                    >
                      <Upload className="mx-auto h-10 w-10 text-slate-400" />
                      <p className="mt-2 text-center text-sm text-slate-600">ドラッグ＆ドロップ、またはクリックして選択</p>
                      <p className="mt-1 text-center text-xs text-slate-500">アップロード中も次へ進めます</p>
                      <p className="mt-2 text-center text-[11px] text-slate-500">
                        アップロードされた動画・PDFは、バックエンド実装後に Track Content Manager (TCM) と自動同期される想定です（現在はモック）。
                      </p>
                      {wizardForm.uploadProgress > 0 && wizardForm.uploadProgress < 100 && (
                        <div className="mx-auto mt-3 w-48 rounded-full bg-slate-200">
                          <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${wizardForm.uploadProgress}%` }} />
                        </div>
                      )}
                      {wizardForm.uploadProgress === 100 && (
                        <p className="mt-2 text-center text-[11px] text-emerald-600">
                          TCM と同期済み（モック）
                        </p>
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
                <label className="block text-xs text-slate-500">想定受講者（スキル開発プラットフォーム連動）</label>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  職種は別システムで定義されている86職種のJDと連動します。左でジョブファミリー、右で具体的な職種をタグ形式で複数選択できます。
                </p>
                <div className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      type="search"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder="職種名で検索"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-5">
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-[11px] font-medium text-slate-600">ジョブファミリー</p>
                      <div className="space-y-1">
                        {JOB_FAMILIES.map((fam) => (
                          <button
                            key={fam.id}
                            type="button"
                            onClick={() => setSelectedJobFamilyId(fam.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs ${
                              selectedJobFamilyId === fam.id
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{fam.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 md:col-span-3">
                      <p className="text-[11px] font-medium text-slate-600">職種（複数選択可）</p>
                      <div className="flex flex-wrap gap-1.5">
                        {MOCK_JOB_ROLES.filter((jr) => {
                          const fam = JOB_FAMILIES.find((f) => f.id === selectedJobFamilyId);
                          if (!fam) return false;
                          const inFamily = fam.roleIds.includes(jr.id);
                          const matches =
                            !jobSearch.trim() ||
                            jr.name.toLowerCase().includes(jobSearch.trim().toLowerCase());
                          return inFamily && matches;
                        }).map((jr) => {
                          const selected = wizardForm.jobRoleIds?.includes(jr.id) ?? false;
                          return (
                            <button
                              key={jr.id}
                              type="button"
                              onClick={() =>
                                setWizardForm((f) => ({
                                  ...f,
                                  jobRoleIds: selected
                                    ? (f.jobRoleIds ?? []).filter((id) => id !== jr.id)
                                    : [...(f.jobRoleIds ?? []), jr.id],
                                }))
                              }
                              className={`rounded-full px-3 py-1.5 text-xs ${
                                selected ? "bg-indigo-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {jr.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {wizardForm.jobRoleIds?.length ? (
                    <div className="mt-2 border-t border-slate-200 pt-2">
                      <p className="mb-1 text-[11px] font-medium text-slate-600">選択中の職種</p>
                      <div className="flex flex-wrap gap-1.5">
                        {wizardForm.jobRoleIds.map((id) => {
                          const jr = MOCK_JOB_ROLES.find((r) => r.id === id);
                          if (!jr) return null;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() =>
                                setWizardForm((f) => ({
                                  ...f,
                                  jobRoleIds: (f.jobRoleIds ?? []).filter((x) => x !== id),
                                }))
                              }
                              className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-[11px] text-white"
                            >
                              <span>{jr.name}</span>
                              <X className="h-3 w-3" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
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
                <p className="mt-0.5 text-[10px] text-slate-500">
                  ライブラリのタグフィルターで検索できます。複数選択可能です。
                  <button
                    type="button"
                    className="ml-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 hover:bg-indigo-100"
                    onClick={() => {
                      const base = new Set(wizardForm.tags ?? []);
                      const candidates = ["生成AI", "データ分析", "プログラミング基礎"];
                      candidates.forEach((t) => base.add(t));
                      setWizardForm((f) => ({ ...f, tags: Array.from(base) as string[] }));
                    }}
                  >
                    JD から生成（モック）
                  </button>
                </p>
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
              {wizardForm.target === "live" && (
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-sm font-medium text-slate-700">ライブ開催スケジュール（モック）</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() =>
                      setWizardForm((f) => ({
                        ...f,
                        liveSchedules: [
                          ...(f.liveSchedules ?? []),
                          {
                            id: String((f.liveSchedules?.length ?? 0) + 1),
                            date: "",
                            startTime: "",
                            endTime: "",
                            mode: f.liveType || "online",
                            onlineUrl: "",
                            venue: "",
                            materialNote: "",
                          },
                        ],
                      }))
                    }
                  >
                    + 日程を追加
                  </button>
                  <div className="space-y-2">
                    {(wizardForm.liveSchedules ?? []).map((s) => (
                      <div
                        key={s.id}
                        className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 text-xs md:flex-row md:items-center"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">開催日</span>
                          <input
                            type="date"
                            value={s.date}
                            onChange={(e) =>
                              setWizardForm((f) => ({
                                ...f,
                                liveSchedules: (f.liveSchedules ?? []).map((x) =>
                                  x.id === s.id ? { ...x, date: e.target.value } : x,
                                ),
                              }))
                            }
                            className="rounded border border-slate-200 px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">時間</span>
                          <input
                            type="time"
                            value={s.startTime}
                            onChange={(e) =>
                              setWizardForm((f) => ({
                                ...f,
                                liveSchedules: (f.liveSchedules ?? []).map((x) =>
                                  x.id === s.id ? { ...x, startTime: e.target.value } : x,
                                ),
                              }))
                            }
                            className="rounded border border-slate-200 px-2 py-1"
                          />
                          <span>〜</span>
                          <input
                            type="time"
                            value={s.endTime}
                            onChange={(e) =>
                              setWizardForm((f) => ({
                                ...f,
                                liveSchedules: (f.liveSchedules ?? []).map((x) =>
                                  x.id === s.id ? { ...x, endTime: e.target.value } : x,
                                ),
                              }))
                            }
                            className="rounded border border-slate-200 px-2 py-1"
                          />
                        </div>
                        {s.mode === "online" ? (
                          <input
                            type="url"
                            value={s.onlineUrl}
                            onChange={(e) =>
                              setWizardForm((f) => ({
                                ...f,
                                liveSchedules: (f.liveSchedules ?? []).map((x) =>
                                  x.id === s.id ? { ...x, onlineUrl: e.target.value } : x,
                                ),
                              }))
                            }
                            placeholder="Zoom / Teams リンク"
                            className="flex-1 rounded border border-slate-200 px-2 py-1"
                          />
                        ) : (
                          <div className="flex flex-1 flex-col gap-1">
                            <input
                              type="text"
                              value={s.venue}
                              onChange={(e) =>
                                setWizardForm((f) => ({
                                  ...f,
                                  liveSchedules: (f.liveSchedules ?? []).map((x) =>
                                    x.id === s.id ? { ...x, venue: e.target.value } : x,
                                  ),
                                }))
                              }
                              placeholder="会場住所"
                              className="rounded border border-slate-200 px-2 py-1"
                            />
                            <input
                              type="text"
                              value={s.materialNote}
                              onChange={(e) =>
                                setWizardForm((f) => ({
                                  ...f,
                                  liveSchedules: (f.liveSchedules ?? []).map((x) =>
                                    x.id === s.id ? { ...x, materialNote: e.target.value } : x,
                                  ),
                                }))
                              }
                              placeholder="事前資料（TCM上のPDFなど）のメモ"
                              className="rounded border border-slate-200 px-2 py-1"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setWizardForm((f) => ({
                              ...f,
                              liveSchedules: (f.liveSchedules ?? []).filter((x) => x.id !== s.id),
                            }))
                          }
                          className="self-start rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    <div className="border-t border-dashed border-slate-200 pt-3">
                      <p className="text-xs font-medium text-slate-700">講師情報（ライブ・外部連携用）</p>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-xs text-slate-500">講師名</label>
                          <input
                            type="text"
                            value={wizardForm.instructorName}
                            onChange={(e) => setWizardForm((f) => ({ ...f, instructorName: e.target.value }))}
                            placeholder="例: 佐藤 花子"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500">プロフィール写真 URL</label>
                          <input
                            type="url"
                            value={wizardForm.instructorAvatarUrl}
                            onChange={(e) => setWizardForm((f) => ({ ...f, instructorAvatarUrl: e.target.value }))}
                            placeholder="https://..."
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500">講師略歴</label>
                          <textarea
                            value={wizardForm.instructorBio}
                            onChange={(e) => setWizardForm((f) => ({ ...f, instructorBio: e.target.value }))}
                            rows={2}
                            placeholder="例: クラウドインフラとDevOpsを専門とする社内認定トレーナー。"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
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
