-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'REJECTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country_of_residence" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Listing" RENAME COLUMN "location" TO "address";
ALTER TABLE "Listing" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured_priority" INTEGER,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "is_premium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "social_links" JSONB,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "views_count" INTEGER NOT NULL DEFAULT 0;

-- Update existing rows with default values for new NOT NULL columns
UPDATE "Listing" SET "city" = 'Unknown' WHERE "city" IS NULL;
UPDATE "Listing" SET "country" = 'Unknown' WHERE "country" IS NULL;
UPDATE "Listing" SET "images" = ARRAY[]::TEXT[] WHERE "images" IS NULL;
UPDATE "Listing" SET "is_premium" = false WHERE "is_premium" IS NULL;
UPDATE "Listing" SET "views_count" = 0 WHERE "views_count" IS NULL;
UPDATE "Listing" SET "verified" = false WHERE "verified" IS NULL;
UPDATE "Listing" SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "approval_status",
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "date" TO "start_datetime";
ALTER TABLE "Event" ADD COLUMN     "banner_image" TEXT,
ADD COLUMN     "end_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "listing_id" TEXT NOT NULL DEFAULT '';

-- Update existing rows with default values for new NOT NULL columns
UPDATE "Event" SET "end_datetime" = CURRENT_TIMESTAMP WHERE "end_datetime" IS NULL;
UPDATE "Event" SET "listing_id" = '' WHERE "listing_id" IS NULL;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "banner_image" TEXT,
ADD COLUMN     "excerpt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "listing_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update existing rows with default values for new NOT NULL columns
UPDATE "Blog" SET "excerpt" = '' WHERE "excerpt" IS NULL;
UPDATE "Blog" SET "listing_id" = '' WHERE "listing_id" IS NULL;
UPDATE "Blog" SET "tags" = ARRAY[]::TEXT[] WHERE "tags" IS NULL;

-- DropTable
DROP TABLE "Payment";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ends_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_payment_at" TIMESTAMP(3),
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stripe_sub_id" DROP NOT NULL;

-- Update existing rows with default values for new NOT NULL columns
UPDATE "Subscription" SET "amount" = 0 WHERE "amount" IS NULL;
UPDATE "Subscription" SET "ends_at" = CURRENT_TIMESTAMP WHERE "ends_at" IS NULL;
UPDATE "Subscription" SET "plan" = 'free' WHERE "plan" IS NULL;
UPDATE "Subscription" SET "started_at" = CURRENT_TIMESTAMP WHERE "started_at" IS NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
