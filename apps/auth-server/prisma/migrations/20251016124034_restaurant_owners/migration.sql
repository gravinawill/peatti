-- CreateEnum
CREATE TYPE "RestaurantOwnerPendingType" AS ENUM ('EMAIL_VERIFICATION', 'WHATSAPP_VERIFICATION');

-- CreateTable
CREATE TABLE "restaurant_owners" (
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "whatsapp" VARCHAR(255) NOT NULL,
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "restaurant_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_owner_pendings" (
    "type" "RestaurantOwnerPendingType" NOT NULL,
    "restaurant_owner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "restaurant_owner_pendings_pkey" PRIMARY KEY ("type","restaurant_owner_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_owners_email_key" ON "restaurant_owners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_owners_whatsapp_key" ON "restaurant_owners"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_owners_id_key" ON "restaurant_owners"("id");

-- CreateIndex
CREATE INDEX "restaurant_owners_id_idx" ON "restaurant_owners"("id");

-- CreateIndex
CREATE INDEX "restaurant_owners_whatsapp_idx" ON "restaurant_owners"("whatsapp");

-- CreateIndex
CREATE INDEX "restaurant_owners_email_idx" ON "restaurant_owners"("email");

-- CreateIndex
CREATE INDEX "restaurant_owner_pendings_restaurant_owner_id_idx" ON "restaurant_owner_pendings"("restaurant_owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_owner_pendings_type_restaurant_owner_id_key" ON "restaurant_owner_pendings"("type", "restaurant_owner_id");

-- AddForeignKey
ALTER TABLE "restaurant_owner_pendings" ADD CONSTRAINT "restaurant_owner_pendings_restaurant_owner_id_fkey" FOREIGN KEY ("restaurant_owner_id") REFERENCES "restaurant_owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
