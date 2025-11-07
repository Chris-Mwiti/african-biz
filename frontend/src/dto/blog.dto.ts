export interface CreateBlogDto {
  title: string;
  content: string;
  listing_id: string;
  // Add other fields as necessary, e.g., category, tags, image
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  listing_id?: string;
  // Add other fields as necessary, e.g., category, tags, image
}
