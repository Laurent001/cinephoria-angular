import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScreeningResponse } from 'src/app/film/film';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  constructor(private http: HttpClient) {}

  getScreeningById(id: number): Observable<ScreeningResponse> {
    return this.http.get<ScreeningResponse>(
      `${environment.url}/api/screening/${id}`
    );
  }
}
