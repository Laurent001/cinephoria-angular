import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {} from 'src/app/film/film';
import { environment } from 'src/environments/environment.dev';
import { ScreeningResponse, ScreeningsByFilmResponse } from './screening';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  private screeningsSubject =
    new BehaviorSubject<ScreeningsByFilmResponse | null>(null);
  screenings$ = this.screeningsSubject.asObservable();

  constructor(private http: HttpClient) {}

  setScreenings(screenings: ScreeningsByFilmResponse) {
    this.screeningsSubject.next(screenings);
  }

  getScreenings() {
    return this.screeningsSubject.value;
  }

  getScreeningById(id: number): Observable<ScreeningResponse> {
    return this.http.get<ScreeningResponse>(
      `${environment.url}/api/screening/${id}`
    );
  }

  getScreeningsByFilmId(id: number): Observable<ScreeningsByFilmResponse> {
    return this.http.get<ScreeningsByFilmResponse>(
      `${environment.url}/api/screening/film/${id}`
    );
  }

  getFilmScreeningsByCinema(
    filmId?: number,
    cinemaId?: number
  ): Observable<ScreeningsByFilmResponse> {
    return this.http.get<ScreeningsByFilmResponse>(
      `${environment.url}/api/screening/film/${filmId}/cinema/${cinemaId}`
    );
  }
}
