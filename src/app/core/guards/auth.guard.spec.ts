import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * ===========================================================================
 * TESTS UNITAIRES DU GUARD : authGuard
 * ===========================================================================
 * Objectifs :
 * - Vérifier que les routes protégées exigent un token JWT
 * - Vérifier la redirection automatique vers /login
 * - Vérifier le comportement lorsque le token est présent
 *
 * Problème classique :
 * Jest ne permet PAS de spy directement sur localStorage.getItem
 * Solution :
 * → espionnage via Storage.prototype.getItem
 * ===========================================================================
 */

describe('authGuard', () => {

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])]
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'parseUrl'); // pour espionner la redirection
  });

  // Reset des mocks
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /* ===========================================================================
     CAS 1 : Aucun token → redirection vers /login
     =========================================================================== */

  it("devrait rediriger vers /login si aucun token n’est présent", () => {

    // Mock du localStorage via le prototype
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(null as any, null as any)
    );

    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });

  /* ===========================================================================
     CAS 2 : Token présent → accès autorisé
     =========================================================================== */

  it("devrait autoriser l’accès si un token est présent", () => {

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake_token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard(null as any, null as any)
    );

    expect(result).toBe(true);
  });

});
