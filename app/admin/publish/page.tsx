"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_COURSES } from "@/lib/mockData";
import type { Course } from "@/lib/mockData";
import { Upload, X, ChevronRight, Check } from "lucide-react";

const publishedList = MOCK_COURSES.slice(0, 8);

export default function PublishPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(false);
  const [published, setPublished] = useState<Course[]>(publishedList);

  function handlePublish() {
    const newCourse: Course = {
      ...MOCK_COURSES[MOCK_COURSES.length - 1],
      id: published.length + 100,
      title: "新規公開コース",
    };
    setPublished((prev) => [...prev, newCourse]);
    setModalOpen(false);
    setStep(1);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-slate-900">eラーニング公開管理</h1>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-medium text-white shadow-lg hover:from-indigo-500 hover:to-violet-500"
        >
          <Upload className="h-5 w-5" />
          マテリアルから新規公開（ワンストップ）
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
          公開済みコース一覧
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                <th className="px-4 py-3 font-semibold text-slate-700">受講者</th>
                <th className="px-4 py-3 font-semibold text-slate-700">種類</th>
              </tr>
            </thead>
            <tbody>
              {published.map((c) => (
                <tr key={c.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-slate-600">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{c.learners}</td>
                  <td className="px-4 py-3 text-slate-600">{c.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 rounded-lg bg-slate-900 px-4 py-3 text-white shadow-lg"
          role="status"
        >
          公開が完了しました。
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 id="wizard-title" className="text-lg font-semibold text-slate-900">
                ワンストップ公開ウィザード
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setStep(1);
                }}
                aria-label="閉じる"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex border-b border-slate-100">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex flex-1 items-center justify-center gap-1 py-3 text-sm ${
                    step >= s ? "text-indigo-600 font-medium" : "text-slate-400"
                  }`}
                >
                  {step > s ? <Check className="h-4 w-4" /> : null}
                  <span>ステップ{s}</span>
                  {s < 3 && <ChevronRight className="h-4 w-4" />}
                </div>
              ))}
            </div>
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">マテリアルをアップロード</p>
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12">
                    <Upload className="h-10 w-10 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">
                      ドラッグ＆ドロップ、またはクリックして選択
                    </p>
                    <button
                      type="button"
                      className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
                    >
                      ファイルを選択
                    </button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">コース設定</p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-xs text-slate-500">コースタイトル</span>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                        placeholder="例: ChatGPT 基礎"
                      />
                    </label>
                    <div className="flex gap-4">
                      <label className="block">
                        <span className="text-xs text-slate-500">対象</span>
                        <select className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-900">
                          <option>e-learning</option>
                          <option>training</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs text-slate-500">配信</span>
                        <select className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-900">
                          <option>自学習</option>
                          <option>ライブ</option>
                        </select>
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-xs text-slate-500">会場</span>
                      <select className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-900">
                        <option>online</option>
                        <option>offline</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">申込・公開設定</p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-xs text-slate-500">申込</span>
                      <select className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-900">
                        <option>即時</option>
                        <option>要申請</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-500">価格</span>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                        placeholder="0"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-500">申込期間</span>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                        placeholder="2024-01-01 〜 2024-12-31"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                戻る
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-violet-500"
                >
                  次へ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-violet-500"
                >
                  公開する
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
