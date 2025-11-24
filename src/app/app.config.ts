import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // PERFORMANCE : Optimise le moteur de détection de changement (fluidité de l'app)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // HTTP & SÉCURITÉ : Configuration globale des appels API
    provideHttpClient(
      withInterceptors([
        // Sécurisation automatique : Injecte le Token JWT dans chaque requête sortante
        authInterceptor
      ])
    ),

    // NAVIGATION : Activation du routage défini dans 'app.routes.ts'
    provideRouter(routes)
  ]
};