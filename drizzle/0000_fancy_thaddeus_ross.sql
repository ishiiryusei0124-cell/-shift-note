CREATE TABLE `shifts` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_shifts_date` ON `shifts` (`date`);