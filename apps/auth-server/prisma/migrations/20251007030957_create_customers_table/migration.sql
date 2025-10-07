-- CreateTable
CREATE TABLE "customers" (
    "name" VARCHAR(255) NOT NULL,
    "whatsapp" VARCHAR(255) NOT NULL,
    "is_whatsapp_verified" BOOLEAN NOT NULL,
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_key" ON "customers"("id");

-- CreateIndex
CREATE INDEX "customers_id_idx" ON "customers"("id");

-- CreateIndex
CREATE INDEX "customers_whatsapp_idx" ON "customers"("whatsapp");
