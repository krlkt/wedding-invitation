DROP INDEX "bride_section_content_wedding_config_id_unique";--> statement-breakpoint
DROP INDEX "bank_details_wedding_config_id_unique";--> statement-breakpoint
DROP INDEX "dress_codes_wedding_config_id_unique";--> statement-breakpoint
DROP INDEX "groom_section_content_wedding_config_id_unique";--> statement-breakpoint
DROP INDEX "user_accounts_email_unique";--> statement-breakpoint
DROP INDEX "wedding_configurations_user_id_unique";--> statement-breakpoint
DROP INDEX "wedding_configurations_subdomain_unique";--> statement-breakpoint
DROP INDEX "starting_section_content_wedding_config_id_unique";--> statement-breakpoint
ALTER TABLE `love_story_segments` ALTER COLUMN "date" TO "date" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `bride_section_content_wedding_config_id_unique` ON `bride_section_content` (`wedding_config_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bank_details_wedding_config_id_unique` ON `bank_details` (`wedding_config_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dress_codes_wedding_config_id_unique` ON `dress_codes` (`wedding_config_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `groom_section_content_wedding_config_id_unique` ON `groom_section_content` (`wedding_config_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_accounts_email_unique` ON `user_accounts` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_configurations_user_id_unique` ON `wedding_configurations` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_configurations_subdomain_unique` ON `wedding_configurations` (`subdomain`);--> statement-breakpoint
CREATE UNIQUE INDEX `starting_section_content_wedding_config_id_unique` ON `starting_section_content` (`wedding_config_id`);