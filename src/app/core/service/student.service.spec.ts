import { TestBed } from '@angular/core/testing';
import { StudentService, Student } from './student.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

/**
 * ===========================================================================
 * TESTS UNITAIRES : StudentService
 * ===========================================================================
 * Objectifs :
 * - Vérifier que chaque méthode HTTP (GET/POST/PUT/DELETE)
 *   envoie bien la requête attendue
 * - Vérifier les URLs, méthodes et payloads
 * - Vérifier que la réponse Observable est correctement retournée
 *
 * Notes :
 * - HttpTestingController intercepte les requêtes HTTP sortantes
 *   et permet de simuler un backend sans serveur réel.
 * - StudentService dépend uniquement de HttpClient → aucun mock nécessaire.
 * ===========================================================================
 */

describe('StudentService', () => {

  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // Active HttpClient + interceptor chain
        provideHttpClient(),
        // Active HttpTestingController pour la capture des requêtes
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il ne reste aucune requête en attente
    httpMock.verify();
  });

  /* ===========================================================================
     CREATION DU SERVICE
     =========================================================================== */

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  /* ===========================================================================
     GET ALL
     =========================================================================== */

  it('devrait récupérer tous les étudiants (GET /api/students)', () => {

    const mockStudents: Student[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com' }
    ];

    service.getAll().subscribe(result => {
      expect(result).toEqual(mockStudents);
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');

    req.flush(mockStudents);
  });

  /* ===========================================================================
     GET BY ID
     =========================================================================== */

  it('devrait récupérer un étudiant par ID (GET /api/students/:id)', () => {

    const mockStudent: Student = {
      id: 42,
      firstName: 'Alice',
      lastName: 'Wonder',
      email: 'alice@test.com'
    };

    service.getById(42).subscribe(result => {
      expect(result).toEqual(mockStudent);
    });

    const req = httpMock.expectOne('/api/students/42');
    expect(req.request.method).toBe('GET');

    req.flush(mockStudent);
  });

  /* ===========================================================================
     CREATE
     =========================================================================== */

  it('devrait créer un étudiant (POST /api/students)', () => {

    const newStudent: Student = {
      id: 0,
      firstName: 'Bob',
      lastName: 'Marley',
      email: 'bob@test.com'
    };

    service.create(newStudent).subscribe(response => {
      expect(response).toBeUndefined(); // service renvoie void
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newStudent);

    req.flush(null);
  });

  /* ===========================================================================
     UPDATE
     =========================================================================== */

  it('devrait mettre à jour un étudiant (PUT /api/students/:id)', () => {

    const updated: Student = {
      id: 12,
      firstName: 'Neo',
      lastName: 'Anderson',
      email: 'neo@matrix.com'
    };

    service.update(12, updated).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/students/12');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);

    req.flush(null);
  });

  /* ===========================================================================
     DELETE
     =========================================================================== */

  it('devrait supprimer un étudiant (DELETE /api/students/:id)', () => {

    service.delete(7).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/students/7');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

});
