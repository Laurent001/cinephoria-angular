import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { FilmResponse } from './film';

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

  updateFilm(film: FilmResponse): Observable<FilmResponse[]> {
    const formData = new FormData();
    formData.append('id', film.id?.toString() || '');
    formData.append('title', film.title);
    formData.append('favorite', film.favorite.toString());
    formData.append('age_minimum', film.age_minimum.toString());
    formData.append('description', film.description);
    formData.append('poster', film.poster);

    if (film.release_date) {
      formData.append('release_date', film.release_date.toString());
    }

    if (film.poster_file) {
      formData.append('poster_file', film.poster_file, film.poster_file.name);
    }
    return this.http.put<FilmResponse[]>(
      `${environment.url}/api/film/update`,
      formData
    );
  }

  deleteFilmById(filmId: number): Observable<FilmResponse[]> {
    return this.http.delete<FilmResponse[]>(
      `${environment.url}/api/film/delete/${filmId}`
    );
  }

  addFilm(film: FilmResponse): Observable<FilmResponse[]> {
    return this.http.post<FilmResponse[]>(
      `${environment.url}/api/film/add`,
      film
    );
  }
}
