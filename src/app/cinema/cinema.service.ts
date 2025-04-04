import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Screening } from '../screening/screening';
import { CinemaResponse, OpeningHoursResponse } from './cinema';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private cinemaSubject = new BehaviorSubject<CinemaResponse | undefined>(
    undefined
  );
  cinema$: Observable<CinemaResponse | undefined> =
    this.cinemaSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateCinemaById(cinemaId?: number): void {
    if (cinemaId)
      this.getCinemaById(cinemaId)
        .pipe(
          tap((cinema) => {
            console.log('cinema : ', cinema);
            this.cinemaSubject.next(cinema);
          })
        )
        .subscribe();
  }

  getCinemas(): Observable<CinemaResponse[]> {
    return this.http.get<CinemaResponse[]>(`${environment.url}/api/cinema`);
  }

  getCinemaById(cinemaId: number): Observable<CinemaResponse> {
    return this.http.get<CinemaResponse>(
      `${environment.url}/api/cinema/${cinemaId}`
    );
  }

  getCinemaByScreening(screening: Screening) {
    return this.http.get<CinemaResponse>(
      `${environment.url}/api/cinema/screening/${screening}`
    );
  }

  getOpeningHours(cinemaId: number): Observable<OpeningHoursResponse[]> {
    return this.http.get<OpeningHoursResponse[]>(
      `${environment.url}/api/cinema/${cinemaId}/openings`
    );
  }
}
