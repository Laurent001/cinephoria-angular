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
  screenings: ScreeningsByDayResponse[];
  screeningSelected?: ScreeningResponse;
}

export interface ScreeningsByDayResponse {
  day: Date;
  screeningsByDay: ScreeningResponse[];
}
