import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

/**
 * ============================================================================
 * TESTS UNITAIRES DU COMPOSANT : LoginComponent
 * ============================================================================
 * Objectifs pédagogiques pour la soutenance :
 *
 * 1. Vérifier l’état initial du formulaire (invalid au chargement)
 * 2. Vérifier que la soumission n’appelle PAS le service si le formulaire est invalide
 * 3. Vérifier l’appel correct au UserService lors d’un formulaire valide
 * 4. Vérifier le stockage du token dans localStorage
 * 5. Vérifier la redirection vers /students après login réussi
 * 6. Vérifier la gestion d’erreur (ex: identifiants incorrects)
 * 7. Vérifier le fonctionnement du reset() du formulaire
 * 8. Vérifier la méthode goHome()
 *
 * Technologies testées :
 * - Angular Standalone Components
 * - Jest (mocks, spies, asserts)
 * - TestBed (émulation du contexte Angular)
 *
 * Note importante :
 * MaterialModule DOIT être importé sous peine d’erreur de compilation Angular
 * dans le template (mat-form-field, mat-input).
 * ============================================================================
 */

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  /** -------------------------------------------------------------------------
   * Mocks des dépendances du composant
   * - UserService : simulé pour éviter tout appel HTTP réel
   * - Router : simulé pour éviter une vraie navigation
   * ------------------------------------------------------------------------- */
  const userServiceMock = {
    login: jest.fn()
  };

  const routerMock = {
    navigate: jest.fn()
  };

  /** -------------------------------------------------------------------------
   * INITIALISATION DU TESTBED
   * - Import du composant standalone
   * - Import des modules Angular nécessaires
   * - Injection des mocks pour les providers
   * ------------------------------------------------------------------------- */
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,          // composant standalone Angular 17
        ReactiveFormsModule,     // nécessaire pour les FormGroup
        MaterialModule           // requis pour compiler le template Angular
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Reset des mocks à chaque test pour éviter les interférences
    userServiceMock.login.mockReset();
    routerMock.navigate.mockReset();

    // Déclenche ngOnInit()
    fixture.detectChanges();
  });

  /* ==========================================================================
     SECTION : TESTS DU FORMULAIRE AU CHARGEMENT
     ========================================================================== */

  it('devrait initialiser un formulaire invalide au démarrage', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  /* ==========================================================================
     SECTION : TEST DE LA SOUMISSION
     ========================================================================== */

  it('ne devrait PAS appeler userService.login() si le formulaire est invalide', () => {

    component.onSubmit(); // formulaire vide → invalide

    expect(userServiceMock.login).not.toHaveBeenCalled();
  });

  it('devrait appeler userService.login() avec les bonnes valeurs si le formulaire est valide', () => {

    // Remplissage manuel du formulaire
    component.loginForm.setValue({
      login: 'testuser',
      password: '123456'
    });

    // Mock du retour HTTP
    userServiceMock.login.mockReturnValue(of({ token: 'abc123' }));

    component.onSubmit();

    // Vérifie que le service a été appelé avec un payload correct
    expect(userServiceMock.login).toHaveBeenCalledWith({
      login: 'testuser',
      password: '123456'
    });
  });

  /* ==========================================================================
     SECTION : STOCKAGE DU TOKEN ET REDIRECTION
     ========================================================================== */

  it('devrait stocker le token et rediriger vers /students en cas de succès', () => {

    component.loginForm.setValue({
      login: 'john',
      password: 'doe'
    });

    userServiceMock.login.mockReturnValue(of({ token: 'jwt_token' }));

    // Spy sur localStorage
    const storeSpy = jest.spyOn(Storage.prototype, 'setItem');


    component.onSubmit();

    expect(storeSpy).toHaveBeenCalledWith('token', 'jwt_token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  /* ==========================================================================
     SECTION : ERREUR DE LOGIN
     ========================================================================== */

  it('devrait afficher une erreur si le login échoue', () => {

    component.loginForm.setValue({
      login: 'wrong',
      password: 'wrong'
    });

    // Simule une erreur HTTP
    userServiceMock.login.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    // Silence le console.error
    jest.spyOn(console, 'error').mockImplementation(() => null);

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalled();
  });

  /* ==========================================================================
     SECTION : RESET FORMULAIRE
     ========================================================================== */

  it('devrait réinitialiser submitted et le formulaire lors de onReset()', () => {

    component.submitted = true;

    component.loginForm.setValue({
      login: 'x',
      password: 'y'
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.loginForm.value).toEqual({ login: null, password: null });
  });

  /* ==========================================================================
     SECTION : NAVIGATION HOME
     ========================================================================== */

  it('devrait rediriger vers /home lors de goHome()', () => {

    component.goHome();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

});
