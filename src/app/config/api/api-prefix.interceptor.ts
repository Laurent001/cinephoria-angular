import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/v1/api')) {
    const apiReq = req.clone({
      url: `${environment.url}${req.url}`,
    });

    return next(apiReq);
  }

  return next(req);
};
