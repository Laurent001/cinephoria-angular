import { Route, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guards';

export const initRoutes = (): Routes => {
  const routes = new Array<Route>();

  routes.push({
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  });

  routes.push({
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 0, name: 'guest' },
        { id: 1, name: 'admin' },
        { id: 2, name: 'staff' },
        { id: 3, name: 'user' },
      ],
    },
  });

  routes.push({
    path: 'film',
    loadComponent: () =>
      import('./film/film.component').then((m) => m.FilmComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 0, name: 'guest' },
        { id: 1, name: 'admin' },
        { id: 2, name: 'staff' },
        { id: 3, name: 'user' },
      ],
    },
  });

  routes.push({
    path: 'booking',
    loadComponent: () =>
      import('./booking/booking.component').then((m) => m.BookingComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 0, name: 'guest' },
        { id: 1, name: 'admin' },
        { id: 2, name: 'staff' },
        { id: 3, name: 'user' },
      ],
    },
  });

  routes.push({
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 0, name: 'guest' },
        { id: 3, name: 'user' },
      ],
    },
  });

  routes.push({
    path: 'incident',
    loadComponent: () =>
      import('./incident/incident.component').then((m) => m.IncidentComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 1, name: 'admin' },
        { id: 2, name: 'staff' },
      ],
    },
  });

  routes.push({
    path: 'intranet',
    loadComponent: () =>
      import('./intranet/intranet.component').then((m) => m.IntranetComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 1, name: 'admin' },
        { id: 2, name: 'staff' },
      ],
    },
  });

  routes.push({
    path: 'space',
    loadComponent: () =>
      import('./space/space.component').then((m) => m.SpaceComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [{ id: 3, name: 'user' }],
    },
  });

  routes.push({
    path: 'password-reset-request',
    loadComponent: () =>
      import(
        './auth/password-reset-request/password-reset-request.component'
      ).then((m) => m.PasswordResetRequestComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [{ id: 0, name: 'guest' }],
    },
  });

  routes.push({
    path: 'password-reset/:token',
    loadComponent: () =>
      import('./auth/password-reset/password-reset.component').then(
        (m) => m.PasswordResetComponent
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [{ id: 0, name: 'guest' }],
    },
  });

  routes.push({
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [{ id: 0, name: 'guest' }],
    },
  });

  routes.push({
    path: 'logout',
    loadComponent: () =>
      import('./logout/logout.component').then((m) => m.LogoutComponent),
    canActivate: [AuthGuard],
    data: {
      roles: [
        { id: 1, name: 'admin' },
        { id: 2, name: 'staff' },
        { id: 3, name: 'user' },
      ],
    },
  });

  return routes;
};
