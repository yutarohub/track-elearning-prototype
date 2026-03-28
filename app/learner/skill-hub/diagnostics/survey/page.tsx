"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function SkillHubDiagnosticsSurveyPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">スキル診断 / スキル調査</nav>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <ClipboardList className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">スキル調査</h1>
        <p className="mt-2 text-sm text-slate-600">
          職種モデルに基づく自己評価フローはプロトタイプ外です。結果は{" "}
          <Link href="/learner/skill-hub/gap" className="text-indigo-600 hover:underline">
            スキルギャップ分析
          </Link>
          と連携する想定です。
        </p>
      </div>
    </div>
  );
}
