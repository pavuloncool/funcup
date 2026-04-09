'use client';

import type { FlavorNoteRank } from '@funcup/shared';

type Props = {
  title: string;
  caption?: string;
  notes: FlavorNoteRank[];
};

export default function TopFlavorNotes({ title, caption, notes }: Props) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      {caption ? <p className="mt-1 text-sm text-zinc-600">{caption}</p> : null}
      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No flavor tags in this selection.</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {notes.map((n, i) => (
            <li
              key={n.id}
              className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-zinc-900">
                <span className="mr-2 tabular-nums text-zinc-400">{i + 1}.</span>
                {n.label}
                <span className="ml-2 text-xs font-normal text-zinc-500">({n.category})</span>
              </span>
              <span className="shrink-0 tabular-nums text-zinc-600">{n.count}×</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
