CREATE TABLE `user_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`addition` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `shifts` ADD `user_id` text;--> statement-breakpoint
CREATE INDEX `idx_shifts_user_date` ON `shifts` (`user_id`,`date`);