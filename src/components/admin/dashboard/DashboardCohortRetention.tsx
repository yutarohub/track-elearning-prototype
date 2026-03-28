import type { MockCohortRow } from "./cohortRetentionUtils";

export interface DashboardCohortRetentionProps {
  rows: MockCohortRow[];
}

function cohortBand(pct: number): { key: "high" | "mid" | "low"; labelJa: string } {
  if (pct >= 70) return { key: "high", labelJa: "高" };
  if (pct >= 40) return { key: "mid", labelJa: "中" };
  return { key: "low", labelJa: "低" };
}

function cellBg(pct: number): string {
  return `hsl(170, 55%, ${92 - (pct / 100) * 55}%)`;
}

function cellFg(pct: number): string {
  if (pct >= 70) return "#ffffff";
  if (pct >= 40) return "#0f172a";
  return "#475569";
}

const WEEKS = [
  { key: "w1" as const, label: "1週後" },
  { key: "w2" as const, label: "2週後" },
  { key: "w3" as const, label: "3週後" },
  { key: "w4" as const, label: "4週後" },
  { key: "w5" as const, label: "5週後" },
];

export function DashboardCohortRetention({ rows }: DashboardCohortRetentionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900" id="cohort-heading">
        ユーザー再帰率（コホート分析）
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        登録週ごとの 1〜5週後のログイン定着率（%）。色は目安であり、<strong className="font-medium text-slate-800">セル内の数値</strong>
        が主情報です。
      </p>

      <div
        className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700"
        role="group"
        aria-label="定着率の凡例"
      >
        <span className="font-semibold text-slate-800">凡例:</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-4 w-6 rounded border border-slate-300 ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: cellBg(35) }}
            aria-hidden
          />
          〜39% 低
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-4 w-6 rounded border border-slate-300 ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: cellBg(55) }}
            aria-hidden
          />
          40〜69% 中
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-4 w-6 rounded border border-slate-300 ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: cellBg(85) }}
            aria-hidden
          />
          70%以上 高
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm" aria-labelledby="cohort-heading">
          <thead>
            <tr>
              <th
                scope="col"
                className="rounded-tl-lg border border-slate-200 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-800"
              >
                登録週
              </th>
              {WEEKS.map((w, i) => (
                <th
                  key={w.key}
                  scope="col"
                  className={`border border-slate-200 bg-slate-100 px-3 py-3 text-center font-semibold text-slate-800 ${
                    i === WEEKS.length - 1 ? "rounded-tr-lg" : ""
                  }`}
                >
                  {w.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.week}>
                <th
                  scope="row"
                  className="border border-slate-200 bg-white px-3 py-2.5 text-left font-medium text-slate-900"
                >
                  {row.week}
                </th>
                {WEEKS.map((w) => {
                  const pct = row[w.key];
                  const band = cohortBand(pct);
                  return (
                    <td
                      key={w.key}
                      className="border border-slate-200 px-2 py-2 text-center ring-1 ring-inset ring-black/[0.08]"
                      style={{
                        backgroundColor: cellBg(pct),
                        color: cellFg(pct),
                      }}
                      aria-label={`登録週 ${row.week}、${w.label}の定着率 ${pct}パーセント、水準 ${band.labelJa}`}
                    >
                      <span className="tabular-nums text-sm font-semibold tracking-tight">{pct}%</span>
                      <span className="mt-0.5 block text-[10px] font-medium opacity-90">({band.labelJa})</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
