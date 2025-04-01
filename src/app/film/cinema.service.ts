import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Screening } from '../screening/screening';
import { CinemaResponse } from './film';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private cinemaSubject = new BehaviorSubject<number | undefined>(undefined);
  cinemaId$: Observable<number | undefined> = this.cinemaSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateCinemaId(cinemaId?: number): void {
    if (cinemaId) this.cinemaSubject.next(cinemaId);
  }

  getCinemas(): Observable<CinemaResponse[]> {
    return this.http.get<CinemaResponse[]>(`${environment.url}/api/cinema`);
  }

  getCinemaByScreening(screening: Screening) {
    return this.http.get<CinemaResponse>(
      `${environment.url}/api/cinema/screening/${screening}`
    );
  }
}
