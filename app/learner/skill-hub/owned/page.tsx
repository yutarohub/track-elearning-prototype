"use client";

import Link from "next/link";
import { MOCK_OWNED_SKILLS } from "@/lib/learnerSkillsMock";
import { Award, ChevronRight } from "lucide-react";

export default function SkillHubOwnedSkillsPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500" aria-label="パンくず">
        <Link href="/learner/skill-hub/home" className="text-indigo-600 hover:text-indigo-800">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        マイスキル / 保有スキル一覧
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">保有スキル一覧</h1>
        <p className="mt-1 text-sm text-slate-600">
          スキル調査・eラーニング・試験などから集約したモック一覧です。
        </p>
      </header>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            <h2 className="font-semibold text-slate-900">スキルカード</h2>
          </div>
        </div>
        <ul className="divide-y divide-slate-100">
          {MOCK_OWNED_SKILLS.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  取得: {s.acquiredAt} · 出所: {s.source}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-800">
                  Lv.{s.level}/{s.maxLevel}
                </span>
                <Link
                  href="/learner/skill-hub/gap"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  ギャップを見る
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
