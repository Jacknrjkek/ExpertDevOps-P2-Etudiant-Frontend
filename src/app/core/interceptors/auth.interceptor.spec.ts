import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

/**
 * ===========================================================================
 * TESTS UNITAIRES DE L’INTERCEPTOR JWT
 * ===========================================================================
 * Objectifs :
 * - Vérifier l'ajout automatique de l'en-tête Authorization
 * - Vérifier le comportement lorsqu’aucun token n’est présent
 * - Vérifier que la requête continue son chemin dans tous les cas
 *
 * Note :
 * On DOIT spy Storage.prototype.getItem
 * ===========================================================================
 */

describe('authInterceptor', () => {

  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  /* ===========================================================================
     CAS 1 : Aucun token → NE PAS ajouter Authorization
     =========================================================================== */

  it("ne doit PAS ajouter l'en-tête Authorization si aucun token n’est présent", () => {

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  /* ===========================================================================
     CAS 2 : Token présent → ajouter Authorization
     =========================================================================== */

  it("doit ajouter l'en-tête Authorization lorsqu’un token est présent", () => {

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake_token_123');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    expect(req.request.headers.get('Authorization')).toBe('Bearer fake_token_123');

    req.flush({});
  });

  /* ===========================================================================
     CAS 3 : Toujours transmettre la requête au handler suivant
     =========================================================================== */

  it("doit transmettre la requête au handler suivant", () => {

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    http.get('/api/next').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne('/api/next');

    req.flush({});
  });

});
