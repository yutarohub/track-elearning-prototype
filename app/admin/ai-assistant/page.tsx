"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Sparkles, Terminal } from "lucide-react";

const MOCK_LOG_LINES = [
  "[2026-03-28 09:01:12] admin@track 検索: 「公開中コースの完了率が低い上位3件」",
  "[2026-03-28 09:01:13] assistant 応答生成完了 (tokens: 842, レイテンシ 1.2s) — モック",
  "[2026-03-28 09:05:44] admin@track アクション: コースID 12 のリマインド草案作成",
  "[2026-03-28 09:05:45] assistant ドラフト保存（未送信）— モック",
];

export default function AdminAiAssistantPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AIアシスタント</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理者向け対話・ログ閲覧のスタブです。本番では監査ログと権限モデルと連携します。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">チャット（プレースホルダー）</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              ここに管理者用のプロンプト入力と回答が表示される想定です。プロトタイプでは接続していません。
            </p>
            <div className="mt-4 rounded-lg border border-dashed border-indigo-200 bg-white/60 p-4 text-sm text-slate-500">
              例: 「先週のTrack公式MAUの変化要因を要約」「完了率が下がったコースの一覧」
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-sm">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <h2 className="font-semibold">アシスタントログ（モック）</h2>
            </div>
            <ul className="mt-4 space-y-2 font-mono text-[11px] leading-relaxed text-slate-300">
              {MOCK_LOG_LINES.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
