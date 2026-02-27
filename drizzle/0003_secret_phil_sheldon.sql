CREATE TABLE `research_papers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`authors` text,
	`institution` varchar(255),
	`abstract` text,
	`url` varchar(500) NOT NULL,
	`pdfUrl` varchar(500),
	`source` varchar(100),
	`categoryId` int,
	`language` enum('en','zh') NOT NULL DEFAULT 'en',
	`publishedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `research_papers_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_papers_url_unique` UNIQUE(`url`)
);
