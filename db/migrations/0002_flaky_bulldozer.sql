CREATE TABLE `pages_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_data` text NOT NULL,
	`owner` text NOT NULL,
	`repo` text NOT NULL,
	`branch` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_table_owner_repo_branch_unique` ON `pages_table` (`owner`,`repo`,`branch`);