CREATE TABLE `course_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`userId` int NOT NULL,
	`status` enum('enrolled','in_progress','completed','dropped') DEFAULT 'enrolled',
	`progress` int DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`certificateUrl` text,
	`lastAccessedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_enrollments_id` PRIMARY KEY(`id`)
);
