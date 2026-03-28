"use client";

import Link from "next/link";
import { MOCK_LEARNING_PATHS } from "@/lib/learnerSkillsMock";
import { GraduationCap } from "lucide-react";

export default function TrackPathsPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">Track e-learning / 学習パス</nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">学習パス</h1>
        <p className="mt-1 text-sm text-slate-600">
          Self-Learning 仕様のステップ状態（Locked / Active / Completed）をモック表示しています。
        </p>
      </header>
      <div className="space-y-4">
        {MOCK_LEARNING_PATHS.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                  <GraduationCap className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">{p.title}</h2>
                  <p className="text-sm text-slate-500">{p.progressLabel}</p>
                </div>
              </div>
              <Link
                href="/learner/track/learning-path"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                生成結果ビュー
              </Link>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.steps.map((s) => (
                <li
                  key={s.id}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    s.state === "completed"
                      ? "bg-emerald-100 text-emerald-900"
                      : s.state === "active"
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
