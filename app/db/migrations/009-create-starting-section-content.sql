-- Migration: Create starting_section_content table
-- Feature: 009-i-want-to (Starting Section Content Management)
-- Date: 2025-10-18
-- Pattern: Follows existing content table pattern (love_story_segments, dress_codes, etc.)

CREATE TABLE starting_section_content (
    id TEXT PRIMARY KEY,
    wedding_config_id TEXT NOT NULL UNIQUE REFERENCES wedding_configurations(id) ON DELETE CASCADE,

    -- Display Names (overrides for starting section)
    groom_display_name TEXT,
    bride_display_name TEXT,

    -- Parent Information
    show_parent_info INTEGER NOT NULL DEFAULT 0,
    groom_father_name TEXT,
    groom_mother_name TEXT,
    bride_father_name TEXT,
    bride_mother_name TEXT,

    -- Wedding Date Display
    show_wedding_date INTEGER NOT NULL DEFAULT 1,

    -- Background Media
    background_type TEXT CHECK(background_type IN ('image', 'video')),
    background_filename TEXT,
    background_file_size INTEGER,
    background_mime_type TEXT,

    -- Timestamps
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Index for fast lookups by wedding_config_id (even though it's unique, helps with FK checks)
CREATE INDEX idx_starting_section_content_wedding_config_id ON starting_section_content(wedding_config_id);
