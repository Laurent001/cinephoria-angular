import { Route, Routes } from '@angular/router';

export const initRoutes = (): Routes => {
  const routes = new Array<Route>();

  routes.push({
    path: 'api/hello',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  });

  return routes;
};
