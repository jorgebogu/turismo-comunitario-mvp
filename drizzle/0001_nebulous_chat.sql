CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`level` enum('semilla','excelencia') DEFAULT 'semilla',
	`iconUrl` text,
	`requirements` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`organization` varchar(255),
	`state` varchar(100),
	`message` text NOT NULL,
	`type` enum('informacion_general','registro_comunidad','distintivo','capacitacion','otro') DEFAULT 'informacion_general',
	`status` enum('nuevo','en_proceso','resuelto') DEFAULT 'nuevo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`category` varchar(100),
	`duration` varchar(50),
	`level` enum('basico','intermedio','avanzado') DEFAULT 'basico',
	`imageUrl` text,
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experience_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`experienceId` int NOT NULL,
	`badgeId` int NOT NULL,
	`awardedAt` timestamp NOT NULL DEFAULT (now()),
	`validUntil` timestamp,
	`status` enum('pending','approved','expired') DEFAULT 'pending',
	CONSTRAINT `experience_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`state` varchar(100) NOT NULL,
	`municipality` varchar(150),
	`community` varchar(200),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`category` enum('ecoturismo','turismo_rural','turismo_aventura','turismo_cultural','observacion_naturaleza','gastronomia') DEFAULT 'ecoturismo',
	`imageUrl` text,
	`galleryUrls` text,
	`contactEmail` varchar(320),
	`contactPhone` varchar(20),
	`website` varchar(500),
	`socialMedia` text,
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('guia','manual','infografia','video','documento','normativa') DEFAULT 'documento',
	`category` varchar(100),
	`fileUrl` text,
	`thumbnailUrl` text,
	`author` varchar(200),
	`isPublic` boolean DEFAULT true,
	`downloadCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
