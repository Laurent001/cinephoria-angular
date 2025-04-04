export interface OpeningHoursResponse {
  id: number;
  cinema_id: number;
  day_of_week: number;
  opening_time: string;
  closing_time: string;
}

export interface CinemaResponse {
  id: number;
  name: string;
  address: string;
  postcode: string;
  city: string;
  phone: string;
  opening_hours?: OpeningHoursResponse[];
}
