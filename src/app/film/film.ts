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
  start_time: Date;
  end_time: Date;
  auditorium_name: string;
  auditorium_seat: number;
  auditorium_handi_seat: number;
  auditorium_cinema_id: number;
  auditorium_quality: string;
  auditorium_price: number;
}

export interface ScreeningsFilmResponse {
  film: FilmResponse;
  screenings: ScreeningResponse[];
}
