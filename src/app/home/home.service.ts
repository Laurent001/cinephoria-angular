import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { FilmsResponse, HelloResponse, UsersResponse } from './home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getHello(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>(`${environment.url}/api/hello`);
  }

  getUsers(): Observable<UsersResponse[]> {
    return this.http.get<UsersResponse[]>(`${environment.url}/api/users`);
  }

  getFilms(): Observable<FilmsResponse[]> {
    return this.http.get<FilmsResponse[]>(`${environment.url}/api/films`);
  }
}
