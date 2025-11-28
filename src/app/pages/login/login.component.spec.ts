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
 * 1. Vérifier l’état initial du formulaire (invalid au démarrage)
 * 2. Vérifier que la soumission n’appelle PAS le service si le formulaire est invalide
 * 3. Vérifier l’appel correct au UserService lors d’un formulaire valide
 * 4. Vérifier le stockage du token dans localStorage
 * 5. Vérifier l’affichage du popup en cas de succès
 * 6. Vérifier le popup d’erreur en cas d’identifiants incorrects
 * 7. Vérifier la redirection uniquement lorsque closePopup() est appelé
 * 8. Vérifier le fonctionnement du reset()
 * 9. Vérifier la méthode goHome()
 *
 * Notes :
 * - MaterialModule requis pour compiler le template
 * - UserService et Router sont mockés
 * ============================================================================
 */

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  /** -------------------------------------------------------------------------
   * Mocks des dépendances (UserService & Router)
   * ------------------------------------------------------------------------- */
  const userServiceMock = {
    login: jest.fn()
  };

  const routerMock = {
    navigate: jest.fn()
  };

  /** -------------------------------------------------------------------------
   * INITIALISATION DU TESTBED
   * ------------------------------------------------------------------------- */
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MaterialModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    userServiceMock.login.mockReset();
    routerMock.navigate.mockReset();

    fixture.detectChanges(); // ngOnInit()
  });

  /* ==========================================================================
     FORMULAIRE AU DÉMARRAGE
     ========================================================================== */

  it('devrait initialiser un formulaire invalide au démarrage', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  /* ==========================================================================
     SOUMISSION FORMULAIRE
     ========================================================================== */

  it('ne devrait PAS appeler userService.login() si le formulaire est invalide', () => {
    component.onSubmit();
    expect(userServiceMock.login).not.toHaveBeenCalled();
  });

  it('devrait appeler userService.login() avec les bonnes valeurs si le formulaire est valide', () => {

    component.loginForm.setValue({
      login: 'testuser',
      password: '123456'
    });

    userServiceMock.login.mockReturnValue(of({ token: 'abc123' }));

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith({
      login: 'testuser',
      password: '123456'
    });
  });

  /* ==========================================================================
     RÉUSSITE LOGIN → POPUP SUCCÈS + PAS DE REDIRECTION IMMÉDIATE
     ========================================================================== */

  it('devrait stocker le token et afficher un popup succès', () => {

    component.loginForm.setValue({
      login: 'john',
      password: 'doe'
    });

    userServiceMock.login.mockReturnValue(of({ token: 'jwt_token' }));

    const storeSpy = jest.spyOn(Storage.prototype, 'setItem');

    component.onSubmit();

    // Token stocké
    expect(storeSpy).toHaveBeenCalledWith('token', 'jwt_token');

    // Popup visible
    expect(component.showPopup).toBe(true);
    expect(component.popupType).toBe('success');

    // Pas de redirection immédiate
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('devrait rediriger vers /students après un closePopup() de succès', () => {

    component.showPopup = true;
    component.popupType = 'success';

    component.closePopup();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  /* ==========================================================================
     ERREUR LOGIN → POPUP ERREUR + AUCUN REDIRECT
     ========================================================================== */

  it('devrait afficher un popup d’erreur si le login échoue', () => {

    component.loginForm.setValue({
      login: 'wrong',
      password: 'wrong'
    });

    userServiceMock.login.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.onSubmit();

    expect(component.showPopup).toBe(true);
    expect(component.popupType).toBe('error');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('ne devrait PAS rediriger après fermeture d’un popup erreur', () => {

    component.showPopup = true;
    component.popupType = 'error';

    component.closePopup();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  /* ==========================================================================
     RESET FORMULAIRE
     ========================================================================== */

  it('devrait réinitialiser le formulaire lors de onReset()', () => {

    component.submitted = true;

    component.loginForm.setValue({
      login: 'x',
      password: 'y'
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.loginForm.value).toEqual({
      login: null,
      password: null
    });
  });

  /* ==========================================================================
     NAVIGATION HOME
     ========================================================================== */

  it('devrait rediriger vers /home lors de goHome()', () => {
    component.goHome();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

});
