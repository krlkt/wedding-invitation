'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/shadcn/sidebar';

import DashboardIcon from '@/components/icons/DashboardIcon';
import InvitationIcon from '@/components/icons/InvitationIcon';
import RsvpIcon from '@/components/icons/RsvpIcon';
import TableIcon from '@/components/icons/TableIcon';
import WhatsappIcon from '@/components/icons/WhatsappIcon';

const menuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { title: 'Digital Invitation', href: '/admin', icon: InvitationIcon },
  { title: 'RSVP', href: '/rsvp', icon: RsvpIcon },
  { title: 'Table Management', href: '/tables', icon: TableIcon },
  { title: 'WhatsApp Invitation', href: '/whatsapp', icon: WhatsappIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <Image
          src="/images/logo/oial.png"
          alt="OIAL Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-lila-50 hover:text-lila-700 ${isActive ? 'bg-lila-100 text-lila-700' : 'text-gray-700'} `}
                >
                  <Link href={item.href}>
                    <Icon width="20" color={isActive ? '#a21caf' : 'currentColor'} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
