import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { ScreeningResponse } from '../screening/screening';
import { CinemaResponse } from './film';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  constructor(private http: HttpClient) {}

  getCinemas(): Observable<CinemaResponse[]> {
    return this.http.get<CinemaResponse[]>(`${environment.url}/api/cinema`);
  }

  getCinemaByScreening(screening: ScreeningResponse) {
    return this.http.get<CinemaResponse>(
      `${environment.url}/api/cinema/screening/${screening}`
    );
  }
}
