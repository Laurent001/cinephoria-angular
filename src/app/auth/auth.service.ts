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

  getUserRoles(userId: number): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.url}/api/users/${userId}/roles`
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

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
