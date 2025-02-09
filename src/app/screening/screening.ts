import { AuditoriumResponse, FilmResponse } from '../film/film';

export interface ScreeningResponse {
  id: number;
  film_id: number;
  start_time: Date;
  end_time: Date;
  auditorium: AuditoriumResponse;
}

export interface ScreeningsByFilmResponse {
  film: FilmResponse;
  screenings: ScreeningResponse[];
  screeningSelected?: ScreeningResponse;
}
