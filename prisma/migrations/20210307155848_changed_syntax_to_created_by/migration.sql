/*
  Warnings:

  - You are about to drop the column `creationAt` on the `Sticker` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Sticker` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Sticker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Sticker` DROP FOREIGN KEY `Sticker_ibfk_2`;

-- AlterTable
ALTER TABLE `Sticker` DROP COLUMN `creationAt`,
    DROP COLUMN `creatorId`,
    ADD COLUMN     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN     `createdById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sticker` ADD FOREIGN KEY (`createdById`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
