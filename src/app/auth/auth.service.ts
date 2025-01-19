import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { User } from '../app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = `${environment.url}/api`;

  constructor(private http: HttpClient) {
    this.userSubject.next({ role: 'guest' } as User);
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  resetUserToGuest() {
    this.userSubject.next({ role: 'guest' } as User);
  }

  getUserRoles(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/users/${userId}/roles`);
  }

  getUserRole(): string | null {
    const user = this.userSubject.value;
    return user ? user.role : null;
  }
}
