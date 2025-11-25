import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';

/**
 * ===========================================================================
 * TESTS UNITAIRES : UserService
 * ===========================================================================
 * Objectifs :
 * - Vérifier que le service peut être instancié correctement par Angular
 * - Vérifier que la configuration de TestBed permet bien l’injection de HttpClient
 *
 * Notes :
 * - Ce test ne vérifie PAS les appels HTTP (login, register, etc.)
 *   → Pour cela, il faudra utiliser HttpTestingController
 * - Ici, on vérifie uniquement que le service existe et que ses dépendances
 *   sont correctement injectées.
 * ===========================================================================
 */

describe('UserService', () => {

  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),   // Injection du HttpClient nécessaire au service
      ]
    });

    // Récupération de l’instance du service via l’injecteur Angular
    service = TestBed.inject(UserService);
  });

  /* ===========================================================================
     TEST : INSTANCIATION DU SERVICE
     =========================================================================== */

  it('should be created', () => {
    // Vérifie simplement que l’instance existe
    expect(service).toBeTruthy();
  });
});
