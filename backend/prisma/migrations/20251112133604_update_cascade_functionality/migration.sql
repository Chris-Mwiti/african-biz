-- DropForeignKey
ALTER TABLE "public"."ListingAnalyticEvent" DROP CONSTRAINT "ListingAnalyticEvent_listing_id_fkey";

-- AddForeignKey
ALTER TABLE "ListingAnalyticEvent" ADD CONSTRAINT "ListingAnalyticEvent_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
