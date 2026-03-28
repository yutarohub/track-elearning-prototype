import type { AIInsightItem } from "@/lib/dashboardMock";

export function findRiskInsight(insights: AIInsightItem[]): AIInsightItem | undefined {
  return insights.find((i) => i.type === "risk");
}

/** ストーリー帯用の1行要約（Tableau 的エグゼクティブサマリー） */
export function buildExecutiveSummaryLine(params: {
  monthLabel: string;
  trackOfficialMau: number;
  planLimit: number;
  trackMauPercent: number;
  riskInsight?: AIInsightItem;
}): string {
  const mau = `${params.monthLabel} · Track公式MAU ${params.trackOfficialMau.toLocaleString()}/${params.planLimit.toLocaleString()}（上限の ${params.trackMauPercent}%）`;
  if (params.riskInsight) {
    const short = params.riskInsight.summary.replace(/\s+/g, " ").trim();
    const clip = short.length > 56 ? `${short.slice(0, 56)}…` : short;
    return `${mau} · 注意: ${clip}`;
  }
  return mau;
}
