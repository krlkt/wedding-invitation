-- Migration 008: Split Instagram Links and Reorganize Content
-- Feature: 008-split-instagram-links
-- Date: 2025-10-14

-- Add new columns for separate Instagram links
ALTER TABLE wedding_configurations
ADD COLUMN grooms_instagram_link TEXT;

ALTER TABLE wedding_configurations
ADD COLUMN bride_instagram_link TEXT;

-- Update feature toggle naming (instagram_link -> instagram_links)
UPDATE feature_toggles
SET feature_name = 'instagram_links'
WHERE feature_name = 'instagram_link';

-- Clear deprecated instagram_link data (testing data only per clarification)
UPDATE wedding_configurations
SET instagram_link = NULL
WHERE instagram_link IS NOT NULL;

-- Note: Column instagram_link kept for backward compatibility
-- Can be dropped in future major version with:
-- ALTER TABLE wedding_configurations DROP COLUMN instagram_link;
