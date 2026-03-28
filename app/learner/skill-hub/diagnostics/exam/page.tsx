"use client";

import Link from "next/link";
import { FileQuestionMark } from "lucide-react";

export default function SkillHubDiagnosticsExamPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">スキル診断 / 試験</nav>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <FileQuestionMark className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">試験</h1>
        <p className="mt-2 text-sm text-slate-600">
          受験環境・問題配信は未接続です。修了後のスキル反映は{" "}
          <Link href="/learner/skill-hub/owned" className="text-indigo-600 hover:underline">
            保有スキル一覧
          </Link>
          で確認する想定です。
        </p>
      </div>
    </div>
  );
}
