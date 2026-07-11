import { Loader2, ChevronUp, ChevronDown } from 'lucide-react';

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ children }) {
  return <p className="text-gray-500 text-sm py-8 text-center">{children}</p>;
}

export function ReorderButtons({ onUp, onDown, disableUp, disableDown }) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onUp}
        disabled={disableUp}
        aria-label="Move up"
        className="text-gray-400 hover:text-amber-600 disabled:opacity-20 disabled:hover:text-gray-400"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={disableDown}
        aria-label="Move down"
        className="text-gray-400 hover:text-amber-600 disabled:opacity-20 disabled:hover:text-gray-400"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
