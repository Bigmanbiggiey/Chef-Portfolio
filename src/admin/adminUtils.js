import { supabase } from '../supabase';

export const inputClass = 'w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500';
export const dangerLinkClass = 'text-red-600 hover:text-red-700 text-xs font-medium';

export function confirmDelete(message = 'Delete this? This cannot be undone.') {
  return window.confirm(message);
}

// Swaps sort_order between list[index] and list[index + direction] (direction: -1 up, 1 down).
// Returns true if a swap happened (caller should reload its list).
export async function reorderRow(table, list, index, direction) {
  const otherIndex = index + direction;
  if (otherIndex < 0 || otherIndex >= list.length) return false;

  const a = list[index];
  const b = list[otherIndex];

  await supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id);
  await supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id);

  return true;
}
