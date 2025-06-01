import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../shared/utils/utils.service';
import { OpinionResponse } from '../space/space';
import { FilmResponse } from './film';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private filmDeletedSubject = new Subject<void>();
  private filmAddedSubject = new Subject<void>();

  filmDeleted$: Observable<void> = this.filmDeletedSubject.asObservable();
  filmAdded$: Observable<void> = this.filmAddedSubject.asObservable();

  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  getFilmById(id?: number): Observable<FilmResponse> {
    return this.http.get<FilmResponse>(`${environment.url}/api/film/${id}`);
  }

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
      .pipe(tap(() => this.filmDeletedSubject.next()));
  }

  addFilm(film: FilmResponse): Observable<FilmResponse[]> {
    const formData = this.utilsService.createFormData(film);

    return this.http
      .post<FilmResponse[]>(
        `${environment.url}/api/intranet/film/add`,
        formData
      )
      .pipe(tap(() => this.filmAddedSubject.next()));
  }

  getOpinion(
    userId: number,
    filmId: number
  ): Observable<OpinionResponse | null> {
    return this.http.get<OpinionResponse>(
      `${environment.url}/api/opinion/user/${userId}/film/${filmId}`
    );
  }
}
