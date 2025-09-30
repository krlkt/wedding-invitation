CREATE TABLE `bank_details` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`bank_name` text,
	`account_name` text,
	`account_number` text,
	`routing_number` text,
	`instructions` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bank_details_wedding_config_id_unique` ON `bank_details` (`wedding_config_id`);--> statement-breakpoint
CREATE TABLE `dress_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`title` text,
	`description` text,
	`photo_filename` text,
	`photo_file_size` integer,
	`photo_mime_type` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dress_codes_wedding_config_id_unique` ON `dress_codes` (`wedding_config_id`);--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`order` integer NOT NULL,
	`alt` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `location_details` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`location_identifier` text NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`google_maps_link` text,
	`ceremony_time` text,
	`reception_time` text,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `love_story_segments` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`date` integer NOT NULL,
	`icon_type` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `feature_toggles` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`feature_name` text NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`rsvp_id` text NOT NULL,
	`table_id` text,
	`name` text NOT NULL,
	`rsvp_name` text NOT NULL,
	`checked_in` integer DEFAULT false NOT NULL,
	`location` text NOT NULL,
	`whatsapp` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rsvp_id`) REFERENCES `rsvps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`name` text NOT NULL,
	`response` text DEFAULT 'maybe' NOT NULL,
	`attendee_count` integer DEFAULT 1 NOT NULL,
	`max_guests` integer DEFAULT 1 NOT NULL,
	`food_choice` text,
	`notes` text DEFAULT '' NOT NULL,
	`location` text NOT NULL,
	`invitation_link` text NOT NULL,
	`group` text,
	`possibly_not_coming` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`name` text NOT NULL,
	`table_number` integer NOT NULL,
	`capacity` integer NOT NULL,
	`location` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wishes` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_config_id` text NOT NULL,
	`guest_id` text,
	`name` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_config_id`) REFERENCES `wedding_configurations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `user_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_accounts_email_unique` ON `user_accounts` (`email`);--> statement-breakpoint
CREATE TABLE `wedding_configurations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subdomain` text NOT NULL,
	`groom_name` text NOT NULL,
	`bride_name` text NOT NULL,
	`wedding_date` integer NOT NULL,
	`monogram_filename` text,
	`monogram_file_size` integer,
	`monogram_mime_type` text,
	`groom_father` text,
	`groom_mother` text,
	`bride_father` text,
	`bride_mother` text,
	`instagram_link` text,
	`footer_text` text,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_configurations_user_id_unique` ON `wedding_configurations` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_configurations_subdomain_unique` ON `wedding_configurations` (`subdomain`);