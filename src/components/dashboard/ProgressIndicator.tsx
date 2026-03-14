"use client";

type Props = {
  completed: number;
  total: number;
  showBadge?: boolean;
};

export function ProgressIndicator({
  completed,
  total,
  showBadge = true,
}: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-amber-100">
        <div
          className="h-full rounded-full bg-amber-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showBadge && (
        <span
          className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-700"
          aria-label={`完了 ${completed} / ${total}`}
        >
          {completed}/{total}
        </span>
      )}
    </div>
  );
}
