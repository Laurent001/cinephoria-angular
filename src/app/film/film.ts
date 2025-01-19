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
  postcode: Date;
  phone: number;
  opening_hours: number;
}

export interface GenreResponse {
  id: number;
  name: string;
}

export interface ScreeningResponse {
  id: number;
  auditorium_id: number;
  remaining_seat: number;
  remaining_handi_seat: number;
  start_time: Date;
  end_time: Date;
}

export interface ScreeningsFilmResponse {
  film: FilmResponse;
  screenings: ScreeningResponse[];
}
