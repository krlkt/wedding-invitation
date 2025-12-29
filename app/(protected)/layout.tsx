/**
 * Admin Layout
 *
 * Shared layout for all admin pages with sidebar navigation.
 * Ensures the dashboard fills the viewport without causing page-level scrollbars.
 */

import { SidebarProvider } from '@/components/shadcn/sidebar';
import { AppSidebar } from '@/components/admin/AppSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
