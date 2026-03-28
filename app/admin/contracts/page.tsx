"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_CONTRACT_SUMMARY } from "@/lib/adminPhase2Mock";
import { FileText, Gauge } from "lucide-react";

export default function AdminContractsPage() {
  const c = MOCK_CONTRACT_SUMMARY;
  const mauPct = Math.round((c.mauCurrent / c.mauLimit) * 100);
  const licPct = Math.round((c.licenseInUse / c.licenseSeats) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">契約</h1>
          <p className="mt-1 text-sm text-slate-500">
            MAU・ライセンス概要（モック）。ダッシュボードの時系列グラフと役割分担する想定です。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">契約プラン</h2>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">プラン名</dt>
                <dd className="text-right font-medium text-slate-900">{c.planName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">更新日</dt>
                <dd className="font-medium text-slate-900">{c.renewalDate}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Gauge className="h-5 w-5 text-violet-600" />
              <h2 className="font-semibold text-slate-900">利用状況</h2>
            </div>
            <div className="mt-4 space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Track公式 MAU</span>
                  <span className="font-semibold text-slate-900">
                    {c.mauCurrent} / {c.mauLimit}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    style={{ width: `${Math.min(mauPct, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{mauPct}% 利用中（モック）</p>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ライセンス席</span>
                  <span className="font-semibold text-slate-900">
                    {c.licenseInUse} / {c.licenseSeats}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400"
                    style={{ width: `${Math.min(licPct, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{licPct}% 割当中</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
