/*
  Warnings:

  - You are about to drop the column `image_url` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `plan_type` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `renewal_date` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_sub_id` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Subscription_stripe_sub_id_key";

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "excerpt" DROP DEFAULT,
ALTER COLUMN "listing_id" DROP DEFAULT,
ALTER COLUMN "tags" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "end_datetime" DROP DEFAULT,
ALTER COLUMN "listing_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "image_url",
DROP COLUMN "is_featured",
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "country" DROP DEFAULT,
ALTER COLUMN "images" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "plan_type",
DROP COLUMN "renewal_date",
DROP COLUMN "stripe_sub_id",
ADD COLUMN     "stripe_subscription_id" TEXT,
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "ends_at" DROP DEFAULT,
ALTER COLUMN "plan" DROP DEFAULT,
ALTER COLUMN "started_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "country_of_residence" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripe_subscription_id_key" ON "Subscription"("stripe_subscription_id");
