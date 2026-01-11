CREATE TABLE `experience_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`experienceId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`title` varchar(255),
	`description` text,
	`altText` varchar(255),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experience_images_id` PRIMARY KEY(`id`)
);
