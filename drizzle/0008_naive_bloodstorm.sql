ALTER TABLE `courses` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `experiences` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `resources` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `reviews` ADD `deletedAt` timestamp;