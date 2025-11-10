/**
 * Admin Layout
 *
 * Layout wrapper for admin pages that prevents body scrolling.
 * Ensures the dashboard fills the viewport without causing page-level scrollbars.
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-screen overflow-hidden bg-gray-50">{children}</div>
}
