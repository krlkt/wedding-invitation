/**
 * Unsaved Changes Bar Component
 *
 * Displays a sticky banner at the bottom of the form when there are unsaved changes.
 * Shows the count of changes and provides Save/Discard actions.
 */

interface UnsavedChangesBarProps {
  totalChanges: number;
  onSave: () => Promise<void>;
  onDiscard: () => Promise<void>;
  saving: boolean;
}

export function UnsavedChangesBar({
  totalChanges,
  onSave,
  onDiscard,
  saving,
}: UnsavedChangesBarProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-yellow-200 bg-yellow-50 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 flex-shrink-0 text-yellow-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium text-yellow-800">
            {totalChanges} unsaved change{totalChanges !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-white disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-pink-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
