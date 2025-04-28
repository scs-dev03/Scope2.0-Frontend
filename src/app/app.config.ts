import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { NgxEchartsModule } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),MessageService, provideAnimationsAsync(),
    provideHttpClient(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                  darkModeSelector: '.my-app-dark',
                  
                  
              }
            }
        }),
        importProvidersFrom(
          NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
          }))
        
  ]
};
