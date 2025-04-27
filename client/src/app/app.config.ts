import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        importProvidersFrom(CarouselModule.forRoot()),
        provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
