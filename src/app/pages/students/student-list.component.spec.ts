import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';

/**
 * ===========================================================================
 * PATCH POUR LES TESTS :
 * ===========================================================================
 * Jest + jsdom ne connaissent pas Bootstrap ni alert().
 * On mocke donc uniquement ce qui manque, sans modifier le reste du fichier.
 * ===========================================================================
 */

// Fake Bootstrap Modal pour éviter "bootstrap is not defined"
(global as any).bootstrap = {
  Modal: class {
    constructor() {}
    show() {}
    hide() {}
  }
};

// Fake alert() pour éviter l'erreur jsdom "not implemented"
(global as any).alert = jest.fn();

/**
 * ===========================================================================
 * TESTS UNITAIRES DU COMPOSANT : StudentListComponent
 * ===========================================================================
 * Objectifs :
 * - Vérifier le comportement du composant sans interaction réelle avec l’API
 * - S’assurer que les formulaires, les actions et les appels au service
 *   fonctionnent correctement
 *
 * Choix techniques :
 * - Utilisation de Jest pour les mocks et assertions
 * - TestBed pour simuler l'environnement Angular d'un composant (DI, formulaires…)
 * ===========================================================================
 */

describe('StudentListComponent', () => {

  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  // ---------------------------------------------------------------------------
  // Mock du StudentService :
  // Permet de simuler les appels HTTP sans contacter le backend.
  // Chaque méthode renvoie ici un Observable simple (of()).
  // ---------------------------------------------------------------------------
  const studentServiceMock = {
    getAll: jest.fn().mockReturnValue(of([])),
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
    delete: jest.fn().mockReturnValue(of({}))
  };

  // Mock du Router pour tester la méthode logout() sans vraie navigation
  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudentListComponent,       // Composant testé
        ReactiveFormsModule         // Requis pour les formulaires réactifs
      ],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;

    // Déclenche ngOnInit + binding Angular
    fixture.detectChanges();
  });

  /* ===========================================================================
     SECTION : INITIALISATION
     =========================================================================== */

  it('devrait charger la liste des étudiants au démarrage (ngOnInit)', () => {
    expect(studentServiceMock.getAll).toHaveBeenCalled();
  });

  /* ===========================================================================
     SECTION : CRÉATION D’ÉTUDIANT
     =========================================================================== */

  it('devrait appeler StudentService.create() lorsque le formulaire de création est valide', () => {
    // Injecte des valeurs valides dans le formulaire
    component.createForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com'
    });

    component.submitCreate();

    // Vérifie que le service a bien été appelé
    expect(studentServiceMock.create).toHaveBeenCalled();
  });

  /* ===========================================================================
     SECTION : MODIFICATION D’ÉTUDIANT
     =========================================================================== */

  it('devrait appeler StudentService.update() lorsque le formulaire d’édition est valide', () => {
    // Simule qu'un étudiant est en cours d'édition
    (component as any).currentEditId = 5;

    component.editForm.setValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@test.com'
    });

    component.submitUpdate();

    expect(studentServiceMock.update).toHaveBeenCalledWith(
      5,
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com'
      }
    );
  });

  /* ===========================================================================
     SECTION : SUPPRESSION D’ÉTUDIANT
     =========================================================================== */

  it('devrait appeler StudentService.delete() lorsque la suppression est confirmée', () => {
    // Remplace window.confirm() pour renvoyer true systématiquement
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.delete(3);

    expect(studentServiceMock.delete).toHaveBeenCalledWith(3);
  });

  /* ===========================================================================
     SECTION : LOGOUT
     =========================================================================== */

  it('devrait supprimer le token et rediriger vers /home lors du logout()', () => {
    // Mock explicite de localStorage pour avoir une fonction jest.fn()
    const removeItemMock = jest.fn();

    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: removeItemMock
      },
      writable: true
    });

    component.logout();

    expect(removeItemMock).toHaveBeenCalledWith('token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});
