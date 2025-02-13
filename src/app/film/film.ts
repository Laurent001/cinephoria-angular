export interface FilmResponse {
  id: number;
  title: string;
  description: string;
  genres: string;
  release_date: Date;
  age_minimum: number;
  favorite: number;
  poster: string;
}

export interface CinemaResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  postcode: number;
  phone: number;
  opening_hours: number;
}

export interface GenreResponse {
  id: number;
  name: string;
}

export interface AuditoriumResponse {
  id: number;
  name: string;
  seat: number;
  handi_seat: number;
  quality: string;
  quality_id: number;
  price: number;
  cinema: CinemaResponse;
}
