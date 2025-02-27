import { AuditoriumResponse, FilmResponse } from '../film/film';

export interface Screening {
  id: number;
  start_time: Date;
  end_time: Date;
  film: FilmResponse;
  auditorium: AuditoriumResponse;
}

export interface ScreeningResponse {
  screenings: Screening[];
  films: FilmResponse[];
  auditoriums: AuditoriumResponse[];
}

export interface ScreeningsByFilmResponse {
  film: FilmResponse;
  screenings: ScreeningsByDayResponse[];
  screeningSelected?: Screening;
}

export interface ScreeningsByDayResponse {
  day: Date;
  screeningsByDay: Screening[];
}
