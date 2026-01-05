/**
 * Icon Mapping Utility
 *
 * Maps iconType strings to React icon components for both form and preview usage.
 */

import MeetIcon from '@/components/icons/MeetIcon';
import BusIcon from '@/components/icons/BusIcon';
import CoupleIcon from '@/components/icons/CoupleIcon';
import CatIcon from '@/components/icons/CatIcon';
import RingIcon from '@/components/icons/RingIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';
import KnotIcon from '@/components/icons/KnotIcon';
import BranchIcon from '@/components/icons/BranchIcon';
import GiftIcon from '@/components/icons/GiftIcon';
import InvitationIcon from '@/components/icons/InvitationIcon';
import WishIcon from '@/components/icons/WishIcon';
import DinnerIcon from '@/components/icons/DinnerIcon';
import TableIcon from '@/components/icons/TableIcon';
import MusicIcon from '@/components/icons/MusicIcon';
import NavigationIcon from '@/components/icons/NavigationIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import { ReactNode } from 'react';

export type IconType =
  | 'meet'
  | 'bus'
  | 'couple'
  | 'cat'
  | 'ring'
  | 'calendar'
  | 'knot'
  | 'branch'
  | 'gift'
  | 'invitation'
  | 'wish'
  | 'dinner'
  | 'table'
  | 'music'
  | 'navigation'
  | 'check';

/**
 * Icon options for dropdown selection
 * Used in LoveStoryForm component
 */
export const ICON_OPTIONS: { value: IconType; label: string }[] = [
  { value: 'meet', label: 'Meet (handshake)' },
  { value: 'bus', label: 'Bus (travel)' },
  { value: 'couple', label: 'Couple (together)' },
  { value: 'cat', label: 'Cat (pet)' },
  { value: 'ring', label: 'Ring (engagement)' },
  { value: 'calendar', label: 'Calendar (date)' },
  { value: 'knot', label: 'Knot (unity)' },
  { value: 'branch', label: 'Branch (nature)' },
  { value: 'gift', label: 'Gift (present)' },
  { value: 'invitation', label: 'Invitation (card)' },
  { value: 'wish', label: 'Wish (star)' },
  { value: 'dinner', label: 'Dinner (meal)' },
  { value: 'table', label: 'Table (reception)' },
  { value: 'music', label: 'Music (notes)' },
  { value: 'navigation', label: 'Navigation (compass)' },
  { value: 'check', label: 'Check (checkmark)' },
];

/**
 * Get icon component from iconType string for dropdown (black icons)
 *
 * @param iconType - The icon type string
 * @returns React icon component with black color
 */
export function getIconComponent(iconType: IconType): ReactNode {
  const iconMap: Record<IconType, ReactNode> = {
    meet: <MeetIcon />,
    bus: <BusIcon />,
    couple: <CoupleIcon />,
    cat: <CatIcon />,
    ring: <RingIcon />,
    calendar: <CalendarIcon />,
    knot: <KnotIcon />,
    branch: <BranchIcon />,
    gift: <GiftIcon />,
    invitation: <InvitationIcon />,
    wish: <WishIcon />,
    dinner: <DinnerIcon />,
    table: <TableIcon />,
    music: <MusicIcon />,
    navigation: <NavigationIcon />,
    check: <CheckIcon />,
  };

  const icon = iconMap[iconType] || <MeetIcon />;

  // Wrap in a container with black color (icons use currentColor)
  return <div className="h-6 w-6 text-black">{icon}</div>;
}

/**
 * Get icon component for preview (white icons)
 *
 * @param iconType - The icon type string
 * @returns React icon component with white color
 */
export function getIconComponentForPreview(iconType: IconType): ReactNode {
  const iconMap: Record<IconType, ReactNode> = {
    meet: <MeetIcon />,
    bus: <BusIcon />,
    couple: <CoupleIcon />,
    cat: <CatIcon />,
    ring: <RingIcon />,
    calendar: <CalendarIcon />,
    knot: <KnotIcon />,
    branch: <BranchIcon />,
    gift: <GiftIcon />,
    invitation: <InvitationIcon />,
    wish: <WishIcon />,
    dinner: <DinnerIcon />,
    table: <TableIcon />,
    music: <MusicIcon />,
    navigation: <NavigationIcon />,
    check: <CheckIcon />,
  };

  const icon = iconMap[iconType] || <MeetIcon />;

  // Return icon wrapped with white color (icons use currentColor)
  return <div className="h-full w-full text-white">{icon}</div>;
}

/**
 * Get human-readable label for an icon type
 *
 * @param iconType - The icon type string
 * @returns Human-readable label
 */
export function getIconLabel(iconType: IconType): string {
  return ICON_OPTIONS.find((opt) => opt.value === iconType)?.label ?? iconType;
}
