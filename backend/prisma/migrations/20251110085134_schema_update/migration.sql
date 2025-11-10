-- CreateIndex
CREATE INDEX "Blog_author_id_idx" ON "Blog"("author_id");

-- CreateIndex
CREATE INDEX "Event_start_datetime_end_datetime_idx" ON "Event"("start_datetime", "end_datetime");
