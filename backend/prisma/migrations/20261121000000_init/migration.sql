-- Initial schema for Alwan Perfumes. Compatible with PostgreSQL 14+ (including Neon).
CREATE TABLE "OwnerUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OwnerUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OwnerUser_username_key" ON "OwnerUser"("username");

CREATE TABLE "Customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

CREATE TABLE "FragranceNote" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "FragranceNote_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "FragranceNote_nameAr_key" ON "FragranceNote"("nameAr");

CREATE TABLE "Purchase" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "perfumeName" TEXT NOT NULL,
    "purchasedAt" DATE NOT NULL,
    "rating" INTEGER NOT NULL,
    "primaryNoteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Purchase_customerId_purchasedAt_idx" ON "Purchase"("customerId", "purchasedAt");
CREATE INDEX "Purchase_purchasedAt_idx" ON "Purchase"("purchasedAt");

CREATE TABLE "PurchaseNote" (
    "purchaseId" UUID NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "PurchaseNote_pkey" PRIMARY KEY ("purchaseId","noteId")
);
CREATE INDEX "PurchaseNote_noteId_idx" ON "PurchaseNote"("noteId");

CREATE TABLE "CustomerFavoriteNote" (
    "customerId" UUID NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "CustomerFavoriteNote_pkey" PRIMARY KEY ("customerId","noteId")
);
CREATE INDEX "CustomerFavoriteNote_noteId_idx" ON "CustomerFavoriteNote"("noteId");

ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_primaryNoteId_fkey" FOREIGN KEY ("primaryNoteId") REFERENCES "FragranceNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PurchaseNote" ADD CONSTRAINT "PurchaseNote_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PurchaseNote" ADD CONSTRAINT "PurchaseNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "FragranceNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomerFavoriteNote" ADD CONSTRAINT "CustomerFavoriteNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerFavoriteNote" ADD CONSTRAINT "CustomerFavoriteNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "FragranceNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_rating_range_check" CHECK ("rating" BETWEEN 1 AND 5);
