import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingResponse } from 'src/app/booking/booking';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getLast7DaysBookingsByFilmId(filmId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(
      `${environment.url}/api/booking/last7days/${filmId}`
    );
  }
}
