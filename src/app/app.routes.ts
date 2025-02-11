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
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user', 'guest', 'employe'] },
  });

  routes.push({
    path: 'film',
    loadComponent: () => import('./film/film.page').then((m) => m.FilmPage),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user', 'guest', 'employe'] },
  });

  routes.push({
    path: 'booking',
    loadComponent: () =>
      import('./booking/booking.page').then((m) => m.BookingPage),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user', 'guest', 'employe'] },
  });

  routes.push({
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.page').then((m) => m.ContactPage),
    canActivate: [AuthGuard],
    data: { roles: ['user', 'guest'] },
  });

  routes.push({
    path: 'incident',
    loadComponent: () =>
      import('./incident/incident.page').then((m) => m.IncidentPage),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employe'] },
  });

  routes.push({
    path: 'intranet',
    loadComponent: () =>
      import('./intranet/intranet.page').then((m) => m.IntranetPage),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employe'] },
  });

  routes.push({
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  });

  routes.push({
    path: 'space',
    loadComponent: () => import('./space/space.page').then((m) => m.SpacePage),
    canActivate: [AuthGuard],
    data: { roles: ['user'] },
  });

  routes.push({
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    canActivate: [AuthGuard],
    data: { roles: ['guest'] },
  });

  routes.push({
    path: 'logout',
    loadComponent: () =>
      import('./logout/logout.page').then((m) => m.LogoutPage),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user', 'employe'] },
  });

  return routes;
};
