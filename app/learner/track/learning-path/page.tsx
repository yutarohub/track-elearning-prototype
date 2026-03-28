"use client";

import Link from "next/link";
import { MOCK_LEARNING_PATHS } from "@/lib/learnerSkillsMock";
import { GitBranch, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import type { PathStepState } from "@/lib/learnerSkillsMock";

function StepIcon({ state }: { state: PathStepState }) {
  if (state === "completed") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  if (state === "active") return <PlayCircle className="h-5 w-5 text-indigo-600" />;
  return <Lock className="h-5 w-5 text-slate-400" />;
}

export default function TrackLearningPathGeneratedPage() {
  const path = MOCK_LEARNING_PATHS[0];

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">Track e-learning / 学習パス自動生成</nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">学習パス自動生成（結果）</h1>
        <p className="mt-1 text-sm text-slate-600">
          レコメンドから生成したパスのモックです。Locked / Active / Completed の状態を表示します。
        </p>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <GitBranch className="h-5 w-5 text-indigo-600" />
          <div>
            <h2 className="font-semibold text-slate-900">{path.title}</h2>
            <p className="text-sm text-slate-500">{path.progressLabel}</p>
          </div>
        </div>
        <ol className="mt-4 space-y-3">
          {path.steps.map((s, i) => (
            <li
              key={s.id}
              className={`flex gap-3 rounded-lg border px-4 py-3 ${
                s.state === "active"
                  ? "border-indigo-200 bg-indigo-50/50"
                  : s.state === "completed"
                    ? "border-emerald-100 bg-emerald-50/30"
                    : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <span className="text-xs font-medium text-slate-400">{i + 1}</span>
              <StepIcon state={s.state} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{s.title}</p>
                <p className="text-xs text-slate-500">{s.type}</p>
              </div>
              <span className="text-xs font-semibold uppercase text-slate-500">{s.state}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learner/track/paths"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            学習パス一覧へ
          </Link>
          <Link href="/learner/track/courses" className="text-sm font-medium text-indigo-600 hover:underline">
            コース一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
