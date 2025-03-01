import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Screening, ScreeningResponse } from 'src/app/screening/screening';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class ScreeningsService {
  constructor(private http: HttpClient) {}

  getScreenings(): Observable<ScreeningResponse> {
    return this.http.get<ScreeningResponse>(`${environment.url}/api/screening`);
  }

  updateScreening(screening: Screening): Observable<ScreeningResponse> {
    const data = { screening, locale: 'Europe/Paris' };
    return this.http.post<ScreeningResponse>(
      `${environment.url}/api/screening/update`,
      data
    );
  }

  deleteScreeningById(screeningId: number): Observable<ScreeningResponse> {
    return this.http.delete<ScreeningResponse>(
      `${environment.url}/api/screening/delete/${screeningId}`
    );
  }

  addScreening(screening: Screening): Observable<ScreeningResponse> {
    return this.http.post<ScreeningResponse>(
      `${environment.url}/api/screening/add`,
      screening
    );
  }
}
