import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { FilmsResponse } from './home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getFilms(): Observable<FilmsResponse[]> {
    return this.http.get<FilmsResponse[]>(`${environment.url}/api/films`);
  }
}
