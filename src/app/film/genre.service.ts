import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenreResponse } from './film';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  constructor(private http: HttpClient) {}

  getGenres(): Observable<GenreResponse[]> {
    return this.http.get<GenreResponse[]>(`${environment.url}/api/genre`);
  }
}
