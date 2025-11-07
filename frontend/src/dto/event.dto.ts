export interface CreateEventDto {
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
  banner_image?: string;
  listing_id: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  start_datetime?: string;
  end_datetime?: string;
  location?: string;
  banner_image?: string;
  listing_id?: string;
}
