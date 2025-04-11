import { registerLocaleData } from '@angular/common';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import '@angular/common/locales/global/fr';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'bootstrap';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';
import { initRoutes } from './app/app.routes';
import { authInterceptor } from './app/config/auth.interceptor';
import { environment } from './environments/environment';

registerLocaleData(localeFr);

if (environment.production) {
  enableProdMode();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(initRoutes(), withHashLocation()),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
  ],
}).catch((err) => console.error(err));
