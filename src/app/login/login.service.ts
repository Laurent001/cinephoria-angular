import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
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

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<any> {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };
    return this.http.post(`${environment.url}/api/register`, data);
  }
}
