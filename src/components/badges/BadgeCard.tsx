import type { ReactNode } from "react";

type BadgeCardProps = {
  accentColor: string;
  /** 受講者・管理者で共通。正方形カードは `aspect-square` を付与 */
  className?: string;
  children: ReactNode;
};

/**
 * オープンバッジ用の外枠（アクセント帯＋白カード）。
 * 受講者・管理者バッジ画面で同じ視覚言語に揃える。
 */
export function BadgeCard({ accentColor, className = "", children }: BadgeCardProps) {
  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-lg ${className}`}
    >
      <div
        className="h-0.5 w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)` }}
      />
      {children}
    </div>
  );
}
