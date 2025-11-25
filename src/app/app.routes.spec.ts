import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { routes } from './app.routes';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

/**
 * ===========================================================================
 * TEST DU FICHIER DE ROUTES
 * ===========================================================================
 * Objectifs :
 * - Vérifier que chaque path pointe vers le bon composant / loadComponent
 * - Vérifier les redirections
 *
 * Remarque importante :
 * - La route /students utilise loadComponent → pas de "component"
 * ===========================================================================
 */

describe('Application Routes', () => {

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ]
    });

    router = TestBed.inject(Router);
  });

  /* ===========================================================================
     ROUTE : /home
     =========================================================================== */

  it("devrait charger HomeComponent pour /home", () => {
    const route = router.config.find(r => r.path === 'home');

    expect(route?.component).toBe(HomeComponent);
  });

  /* ===========================================================================
     ROUTE : /login
     =========================================================================== */

  it("devrait charger LoginComponent pour /login", () => {
    const route = router.config.find(r => r.path === 'login');

    expect(route?.component).toBe(LoginComponent);
  });

  /* ===========================================================================
     ROUTE : /register
     =========================================================================== */

  it("devrait charger RegisterComponent pour /register", () => {
    const route = router.config.find(r => r.path === 'register');

    expect(route?.component).toBe(RegisterComponent);
  });

  /* ===========================================================================
     ROUTE : /students (lazy load avec loadComponent)
     =========================================================================== */

  it("devrait définir une route /students en lazy-loading (loadComponent)", () => {
    const route = router.config.find(r => r.path === 'students');

    expect(route).toBeTruthy();
    expect(route?.loadComponent).toBeInstanceOf(Function);
    expect(route?.component).toBeUndefined(); // normal
  });

  /* ===========================================================================
     ROUTE : '' (root) redirige vers home (sans /)
     =========================================================================== */

  it("devrait rediriger '' vers 'home'", () => {
    const route = router.config.find(r => r.path === '');

    expect(route?.redirectTo).toBe('home');
    expect(route?.pathMatch).toBe('full');
  });

  /* ===========================================================================
     ROUTE : wildcard **
     =========================================================================== */

  it("devrait rediriger '**' vers ''", () => {
    const route = router.config.find(r => r.path === '**');

    expect(route?.redirectTo).toBe('');
  });

});
