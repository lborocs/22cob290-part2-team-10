/*
  Warnings:

  - Added the required column `deadline` to the `ProjectTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProjectTask` ADD COLUMN `deadline` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `UserTask` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `stage` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTaskTags` (
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserTaskToUserTaskTags` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserTaskToUserTaskTags_AB_unique`(`A`, `B`),
    INDEX `_UserTaskToUserTaskTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserTask` ADD CONSTRAINT `UserTask_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserTaskToUserTaskTags` ADD CONSTRAINT `_UserTaskToUserTaskTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `UserTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserTaskToUserTaskTags` ADD CONSTRAINT `_UserTaskToUserTaskTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserTaskTags`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
