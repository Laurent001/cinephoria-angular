import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../app';
import { RegisterResponse } from './login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<RegisterResponse> {
    const body = { email, password };
    return this.http.post<RegisterResponse>(
      `${environment.url}/api/login`,
      body
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${environment.url}/api/register`, user);
  }
}
