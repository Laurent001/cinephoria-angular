import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { User } from '../app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  user$ = this.userSubject.asObservable();
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient) {
    this.userSubject.next({ id: 0, role: 'guest' } as User);
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getCurrentUser(): User | undefined {
    return this.userSubject.value;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  resetUserToGuest() {
    this.userSubject.next({ role: 'guest' } as User);
  }

  getRolesByUserId(userId: number): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.url}/api/user/${userId}/roles`
    );
  }

  getUserRole(): string | null {
    const user = this.userSubject.value;
    return user ? user.role : null;
  }

  hasRole(roles: string[]): boolean {
    const user = this.userSubject.value;
    return user ? roles.includes(user.role) : false;
  }

  getUserByToken(token: string): Observable<User> {
    return this.http.get<User>(`${environment.url}/api/user/token/${token}`);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      `${environment.url}/api/login/password-reset/request`,
      {
        email,
      }
    );
  }

  passwordReset(reset_token: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.url}/api/login/password-reset`, {
      reset_token,
      newPassword,
    });
  }
}
