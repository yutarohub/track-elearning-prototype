import { Radio } from "lucide-react";
import type { AIInsightItem, MauByMonth } from "@/lib/dashboardMock";
import type { MockCohortRow } from "./cohortRetentionUtils";
import { DashboardMauBlock, type MauTab } from "./DashboardMauBlock";
import { DashboardCohortRetention } from "./DashboardCohortRetention";
import { DashboardInsightsPanel } from "./DashboardInsightsPanel";

export interface DashboardEngagementSectionProps {
  mauTab: MauTab;
  onMauTabChange: (t: MauTab) => void;
  mauByMonth: MauByMonth[];
  platformMau: number;
  trackOfficialMau: number;
  planLimit: number;
  trackMauPercent: number;
  selectedMonthLabel: string;
  cohortRows: MockCohortRow[];
  insights: AIInsightItem[];
}

export function DashboardEngagementSection({
  mauTab,
  onMauTabChange,
  mauByMonth,
  platformMau,
  trackOfficialMau,
  planLimit,
  trackMauPercent,
  selectedMonthLabel,
  cohortRows,
  insights,
}: DashboardEngagementSectionProps) {
  return (
    <section id="dashboard-engagement" aria-labelledby="dash-engagement-heading" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2 text-slate-700">
        <Radio className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
        <div>
          <h2 id="dash-engagement-heading" className="text-sm font-semibold text-slate-900">
            2. エンゲージメント（利用・定着）
          </h2>
          <p className="text-xs text-slate-500">
            まず MAU の推移を把握し、続けて定着のコホートと AI による解釈を対比します。
          </p>
        </div>
      </div>

      <DashboardMauBlock
        mauTab={mauTab}
        onMauTabChange={onMauTabChange}
        mauByMonth={mauByMonth}
        platformMau={platformMau}
        trackOfficialMau={trackOfficialMau}
        planLimit={planLimit}
        trackMauPercent={trackMauPercent}
        selectedMonthLabel={selectedMonthLabel}
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="space-y-3 xl:col-span-3">
          <DashboardCohortRetention rows={cohortRows} />
        </div>
        <div className="xl:col-span-2">
          <DashboardInsightsPanel insights={insights} />
        </div>
      </div>
    </section>
  );
}
