-- DropForeignKey
ALTER TABLE `PostHistory` DROP FOREIGN KEY `PostHistory_postId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTask` DROP FOREIGN KEY `ProjectTask_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `ProjectTask` ADD CONSTRAINT `ProjectTask_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostHistory` ADD CONSTRAINT `PostHistory_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
