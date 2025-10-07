/*
  Warnings:

  - You are about to drop the column `is_email_verified` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `is_whatsapp_verified` on the `customers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomerPendingType" AS ENUM ('EMAIL_VERIFICATION', 'WHATSAPP_VERIFICATION');

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "is_email_verified",
DROP COLUMN "is_whatsapp_verified";

-- CreateTable
CREATE TABLE "customer_pendings" (
    "type" "CustomerPendingType" NOT NULL,
    "customer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "customer_pendings_pkey" PRIMARY KEY ("type","customer_id")
);

-- CreateIndex
CREATE INDEX "customer_pendings_customer_id_idx" ON "customer_pendings"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_pendings_type_customer_id_key" ON "customer_pendings"("type", "customer_id");

-- AddForeignKey
ALTER TABLE "customer_pendings" ADD CONSTRAINT "customer_pendings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
