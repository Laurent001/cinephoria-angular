import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateConfig } from './config/i18n/translate-config';

export const appConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, TranslateConfig),
    provideRouter([]),
  ],
};
