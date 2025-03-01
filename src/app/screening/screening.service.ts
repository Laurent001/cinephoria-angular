import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Screening, ScreeningsByFilmResponse } from './screening';

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

  getScreeningById(id: number): Observable<Screening> {
    return this.http.get<Screening>(`${environment.url}/api/screening/${id}`);
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
