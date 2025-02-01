import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { FilmResponse, ScreeningsFilmResponse } from './film';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  constructor(private http: HttpClient) {}

  getFilms(): Observable<FilmResponse[]> {
    return this.http.get<FilmResponse[]>(`${environment.url}/api/film`);
  }

  getFilmsByCinema(id?: number): Observable<FilmResponse[]> {
    return this.http.get<FilmResponse[]>(
      `${environment.url}/api/film/cinema/${id}`
    );
  }

  getFilmsByGenre(id?: number): Observable<FilmResponse[]> {
    return this.http.get<FilmResponse[]>(
      `${environment.url}/api/film/genre/${id}`
    );
  }

  getFilmsByDate(date: string): Observable<FilmResponse[]> {
    return this.http.get<FilmResponse[]>(
      `${environment.url}/api/film/date/${date}`
    );
  }

  getScreeningsByFilmId(id: number): Observable<ScreeningsFilmResponse> {
    return this.http.get<ScreeningsFilmResponse>(
      `${environment.url}/api/film/${id}/screenings`
    );
  }
}
