/*
  Warnings:

  - You are about to drop the column `long` on the `Location` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[name]` on the table `Creator`. If there are existing duplicate values, the migration will fail.
  - Added the required column `lng` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Location` DROP COLUMN `long`,
    ADD COLUMN     `lng` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Creator.name_unique` ON `Creator`(`name`);
