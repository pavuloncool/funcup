'use client';

import type { RatingSummary } from '@funcup/shared';

type Props = {
  title: string;
  caption?: string;
  summary: RatingSummary;
};

const STARS = ['1', '2', '3', '4', '5'] as const;

export default function AnalyticsSummary({ title, caption, summary }: Props) {
  const maxBar = Math.max(
    1,
    ...STARS.map(s => summary.ratingDistribution[s] ?? 0)
  );

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      {caption ? <p className="mt-1 text-sm text-zinc-600">{caption}</p> : null}
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total tastings
          </dt>
          <dd className="text-2xl font-semibold tabular-nums text-zinc-900">
            {summary.totalTastings}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Average rating
          </dt>
          <dd className="text-2xl font-semibold tabular-nums text-zinc-900">
            {summary.totalTastings > 0 ? summary.avgRating.toFixed(2) : '—'}
            <span className="ml-1 text-base font-normal text-zinc-500">/ 5</span>
          </dd>
        </div>
      </dl>
      <div className="mt-6">
        <h3 className="text-sm font-medium text-zinc-800">Rating distribution</h3>
        <ul className="mt-3 space-y-2">
          {STARS.map(star => {
            const count = summary.ratingDistribution[star] ?? 0;
            const width = `${Math.round((count / maxBar) * 100)}%`;
            return (
              <li key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8 shrink-0 tabular-nums text-zinc-600">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-800 transition-all"
                    style={{ width }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right tabular-nums text-zinc-700">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
