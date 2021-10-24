/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Sticker`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Sticker.name_unique` ON `Sticker`(`name`);
