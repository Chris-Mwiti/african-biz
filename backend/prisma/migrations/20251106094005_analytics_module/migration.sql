-- CreateEnum
CREATE TYPE "AnalyticEventType" AS ENUM ('VIEW', 'CLICK', 'CONTACT');

-- CreateTable
CREATE TABLE "ListingAnalyticEvent" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "user_id" TEXT,
    "event_type" "AnalyticEventType" NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingAnalyticEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListingAnalyticEvent" ADD CONSTRAINT "ListingAnalyticEvent_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAnalyticEvent" ADD CONSTRAINT "ListingAnalyticEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
