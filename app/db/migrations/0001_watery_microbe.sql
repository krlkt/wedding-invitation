CREATE TABLE `bride_section_content` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`bride_display_name` text,
	`show_parent_info` integer DEFAULT false NOT NULL,
	`father_name` text,
	`mother_name` text,
	`photos` text DEFAULT '[]',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bride_section_content_wedding_config_id_unique` ON `bride_section_content` (`wedding_config_id`);--> statement-breakpoint
CREATE TABLE `groom_section_content` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`groom_display_name` text,
	`show_parent_info` integer DEFAULT false NOT NULL,
	`father_name` text,
	`mother_name` text,
	`photos` text DEFAULT '[]',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `groom_section_content_wedding_config_id_unique` ON `groom_section_content` (`wedding_config_id`);--> statement-breakpoint
CREATE TABLE `starting_section_content` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`groom_display_name` text,
	`bride_display_name` text,
	`show_parent_info` integer DEFAULT false NOT NULL,
	`groom_father_name` text,
	`groom_mother_name` text,
	`bride_father_name` text,
	`bride_mother_name` text,
	`show_wedding_date` integer DEFAULT true NOT NULL,
	`background_type` text,
	`background_filename` text,
	`background_original_name` text,
	`background_file_size` integer,
	`background_mime_type` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `starting_section_content_wedding_config_id_unique` ON `starting_section_content` (`wedding_config_id`);--> statement-breakpoint
ALTER TABLE `wedding_configurations` ADD `grooms_instagram_link` text;--> statement-breakpoint
ALTER TABLE `wedding_configurations` ADD `bride_instagram_link` text;