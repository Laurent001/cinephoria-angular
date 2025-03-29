import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Role } from '../app';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const requiredRoles = route.data['roles'] as Role[];

    return this.authService.user$.pipe(
      take(1),
      map((user) => {
        if (user && requiredRoles.some((role) => role.id === user.role.id)) {
          return true;
        }

        return false;
      })
    );
  }
}
