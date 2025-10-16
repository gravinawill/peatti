/*
  Warnings:

  - Added the required column `password_encrypted` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_encrypted` to the `restaurant_owners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "password_encrypted" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "restaurant_owners" ADD COLUMN     "password_encrypted" VARCHAR(255) NOT NULL;
