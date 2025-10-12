/**
 * Empty State Component
 *
 * Displays when a feature is enabled but has no content yet.
 * Provides helpful messaging to guide users to add content.
 */

interface EmptyStateProps {
    message: string
    icon?: string
}

export default function EmptyState({ message, icon = '📝' }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    )
}
