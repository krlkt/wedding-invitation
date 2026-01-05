/**
 * Feature Definitions
 *
 * Single source of truth for wedding feature metadata.
 * Provides feature labels, descriptions, and configuration.
 */

import { type FeatureName } from '@/db/schema/features';

export interface FeatureDefinition {
  name: FeatureName;
  label: string;
  description: string;
  hasContentForm: boolean;
}

export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    name: 'hero',
    label: 'Starting Section',
    description: 'Opening section with couple names and wedding date',
    hasContentForm: true,
  },
  {
    name: 'groom_and_bride',
    label: 'Groom and Bride',
    description: 'Introduction of the groom and bride',
    hasContentForm: true,
  },
  {
    name: 'love_story',
    label: 'Love Story',
    description: 'Timeline of your relationship',
    hasContentForm: true,
  },
  {
    name: 'save_the_date',
    label: 'Save The Date',
    description: 'Save the date section with add to calendar button',
    hasContentForm: false,
  },
  {
    name: 'location',
    label: 'Location',
    description: 'Event location',
    hasContentForm: false,
  },
  {
    name: 'rsvp',
    label: 'RSVP',
    description: 'Guest response management',
    hasContentForm: false,
  },
  {
    name: 'gallery',
    label: 'Gallery',
    description: 'Photo gallery',
    hasContentForm: false,
  },
  {
    name: 'prewedding_videos',
    label: 'Pre-wedding Videos',
    description: 'Video embeds',
    hasContentForm: false,
  },
  {
    name: 'faqs',
    label: 'FAQs',
    description: 'Frequently asked questions',
    hasContentForm: true,
  },
  {
    name: 'dress_code',
    label: 'Dress Code',
    description: 'Attire guidelines',
    hasContentForm: false,
  },
  {
    name: 'gift',
    label: 'Gift',
    description: 'Information for guests who want to send digital gift(s)',
    hasContentForm: false,
  },
  {
    name: 'wishes',
    label: 'Wishes',
    description: 'Guest wishes and messages',
    hasContentForm: false,
  },
  {
    name: 'footer',
    label: 'Footer',
    description: 'Closing section with thank you message',
    hasContentForm: false,
  },
] as const;

// Helper to get feature by name
export function getFeatureDefinition(name: FeatureName): FeatureDefinition | undefined {
  return FEATURE_DEFINITIONS.find((f) => f.name === name);
}

// Helper to check if feature has content form
export function hasContentForm(name: FeatureName): boolean {
  return getFeatureDefinition(name)?.hasContentForm ?? false;
}
