CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`certificateCode` varchar(50) NOT NULL,
	`userName` varchar(255) NOT NULL,
	`courseTitle` varchar(255) NOT NULL,
	`courseLevel` varchar(50),
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`pdfUrl` text,
	`isValid` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateCode_unique` UNIQUE(`certificateCode`)
);
