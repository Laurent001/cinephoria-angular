import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { UtilsService } from '../utils/utils.service';
import { FilmResponse } from './film';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  filmDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient, private utilsService: UtilsService) {}

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

  updateFilm(film: FilmResponse): Observable<FilmResponse[]> {
    const formData = this.utilsService.createFormData(film);

    return this.http.put<FilmResponse[]>(
      `${environment.url}/api/intranet/film/update`,
      formData
    );
  }

  deleteFilmById(filmId: number): Observable<FilmResponse[]> {
    return this.http
      .delete<FilmResponse[]>(
        `${environment.url}/api/intranet/film/delete/${filmId}`
      )
      .pipe(
        tap(() => {
          this.filmDeleted.emit();
        })
      );
  }

  onFilmDeleted(callback: () => void) {
    return this.filmDeleted.subscribe(callback);
  }

  addFilm(film: FilmResponse): Observable<FilmResponse[]> {
    const formData = this.utilsService.createFormData(film);

    return this.http.post<FilmResponse[]>(
      `${environment.url}/api/intranet/film/add`,
      formData
    );
  }
}
