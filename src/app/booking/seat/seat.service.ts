import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { SeatsScreeningResponse } from './seat';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  constructor(private http: HttpClient) {}

  getSeatsByScreeningId(id: number): Observable<SeatsScreeningResponse> {
    return this.http.get<SeatsScreeningResponse>(
      `${environment.url}/api/screening/${id}/seats`
    );
  }
}
