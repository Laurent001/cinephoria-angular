import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { User } from '../app';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  setLoginUser(email: string, password: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  setUserLogin(email: string, password: string): Observable<User> {
    const body = { email, password };
    return this.http.post<User>(`${environment.url}/api/login`, body);
  }
}
