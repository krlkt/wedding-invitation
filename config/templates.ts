/**
 * Template Configuration
 *
 * Defines requirements and constraints for each wedding invitation template.
 * Used by forms to show appropriate number of photo slots and validate uploads.
 */

export interface TemplatePhotoRequirements {
  min: number;
  max: number;
  recommended: number;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  groomPhotos: TemplatePhotoRequirements;
  bridePhotos: TemplatePhotoRequirements;
}

/**
 * Template 1: Zoom Grid Photos
 * Original template with 6-photo zoom animation grid
 */
const template1: TemplateConfig = {
  id: 'template-1',
  name: 'Zoom Grid',
  description: 'Animated photo grid with zoom effects (needs 3-6 photos for best results)',
  groomPhotos: {
    min: 3,
    max: 6,
    recommended: 6,
  },
  bridePhotos: {
    min: 3,
    max: 6,
    recommended: 6,
  },
};

/**
 * Template 2: Minimal Single Photo (Placeholder for future)
 * Simple template with single hero photo per person
 */
const template2: TemplateConfig = {
  id: 'template-2',
  name: 'Minimal',
  description: 'Clean and simple with single portrait photo',
  groomPhotos: {
    min: 1,
    max: 1,
    recommended: 1,
  },
  bridePhotos: {
    min: 1,
    max: 1,
    recommended: 1,
  },
};

/**
 * Template 3: Carousel Gallery (Placeholder for future)
 * Carousel-style photo gallery
 */
const template3: TemplateConfig = {
  id: 'template-3',
  name: 'Carousel',
  description: 'Swipeable carousel gallery (2-8 photos)',
  groomPhotos: {
    min: 2,
    max: 8,
    recommended: 5,
  },
  bridePhotos: {
    min: 2,
    max: 8,
    recommended: 5,
  },
};

/**
 * All available templates
 */
export const TEMPLATES: Record<string, TemplateConfig> = {
  'template-1': template1,
  'template-2': template2,
  'template-3': template3,
};

/**
 * Get template configuration by ID
 */
export function getTemplateConfig(templateId: string): TemplateConfig {
  return TEMPLATES[templateId] ?? TEMPLATES['template-1'];
}

/**
 * Get all available template IDs
 */
export function getAvailableTemplateIds(): string[] {
  return Object.keys(TEMPLATES);
}

/**
 * Default template (used when none specified)
 */
export const DEFAULT_TEMPLATE_ID = 'template-1';
