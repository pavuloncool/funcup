'use client';

import type { BrewMethodOption } from '@funcup/shared';

type Props = {
  options: BrewMethodOption[];
  value: string | null;
  onChange: (brewMethodId: string | null) => void;
  disabled?: boolean;
};

export default function BrewMethodFilter({
  options,
  value,
  onChange,
  disabled,
}: Props) {
  if (options.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
        Brew method filter appears when tastings include a brew method.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Brew method</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Filter the sections below; published batch totals above stay unchanged.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(null)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            value === null
              ? 'border-zinc-900 bg-zinc-900 text-white'
              : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          All methods
        </button>
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              value === opt.id
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}
