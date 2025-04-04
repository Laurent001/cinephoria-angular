import { CinemaResponse } from '../cinema/cinema';

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
  rating?: number;
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
