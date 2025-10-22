-- Add original filename field for background media
-- Feature 009: Starting Section Content Management

ALTER TABLE starting_section_content
ADD COLUMN background_original_name TEXT;
