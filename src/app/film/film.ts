export interface FilmResponse {
  id?: number;
  title: string;
  description: string;
  genres?: string;
  release_date: Date;
  age_minimum?: number;
  favorite: number;
  poster: string;
  poster_file?: File;
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

export interface Auditorium {
  id?: number;
  name: string;
  seat: number;
  seat_handi: number;
  price: number;
  cinema?: CinemaResponse;
  quality?: QualityResponse;
}

export interface AuditoriumResponse {
  auditoriums: Auditorium[];
  cinemas: CinemaResponse[];
  qualities: QualityResponse[];
}

export interface QualityResponse {
  id: number;
  name: string;
  price: number;
}
