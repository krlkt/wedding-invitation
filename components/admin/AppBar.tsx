'use client';

import { SidebarTrigger } from '@/components/shadcn/sidebar';
import LogoutButton from '@/components/LogoutButton';

interface AppBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppBar({ title, subtitle, actions }: AppBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
      <SidebarTrigger className="text-gray-700 hover:bg-lila-50" />

      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}

      <LogoutButton />
    </header>
  );
}
