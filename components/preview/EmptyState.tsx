/**
 * Empty State Component
 *
 * Displays when a feature is enabled but has no content yet.
 * Provides helpful messaging to guide users to add content.
 */

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = '📝' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
