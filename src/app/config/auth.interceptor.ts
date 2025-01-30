import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor called for URL:', req.url);
  const token = localStorage.getItem('auth-token');
  console.log(token);

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `BearerZ ${token}` },
    });
    return next(authReq);
  }
  return next(req);
};
