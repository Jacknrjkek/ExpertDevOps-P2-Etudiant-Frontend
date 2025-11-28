import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * ===========================================================================
 * TESTS UNITAIRES DU COMPOSANT : RegisterComponent
 * ===========================================================================
 * Objectifs pédagogiques pour la soutenance :
 *
 * 1. Vérifier l’initialisation correcte du formulaire
 * 2. Vérifier la validation des champs (form invalid au départ)
 * 3. Vérifier l’appel correct au UserService lors d’un formulaire valide
 * 4. Vérifier le popup en cas de succès
 * 5. Vérifier que la redirection se fait dans closePopup() après succès
 * 6. Vérifier la gestion d’erreur côté API → popup erreur (pas d’alert)
 * 7. Vérifier le reset du formulaire
 *
 * Technologies testées :
 * - Angular Standalone Components
 * - ReactiveFormsModule
 * - Jest (mocks, spies, asserts)
 *
 * Note :
 * UserService et Router sont mockés pour éviter tout side-effect.
 * ===========================================================================
 */

describe('RegisterComponent', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  // Mock UserService
  const userServiceMock = {
    register: jest.fn()
  };

  // Mock Router
  const routerMock = {
    navigate: jest.fn()
  };

  // =====================================================================
  // INITIALISATION DU TESTBED
  // =====================================================================
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,       // composant standalone Angular 17
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    userServiceMock.register.mockReset();
    routerMock.navigate.mockReset();

    fixture.detectChanges();
  });

  /* ===========================================================================
     TEST : LE COMPOSANT DOIT ÊTRE CRÉÉ
     =========================================================================== */
  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  /* ===========================================================================
     VALIDATION DU FORMULAIRE
     =========================================================================== */
  it('le formulaire devrait être invalide lorsqu’il est vide', () => {
    expect(component.registerForm.invalid).toBe(true);
  });

  /* ===========================================================================
     TEST : APPEL DU SERVICE AVEC UN FORMULAIRE VALIDE
     =========================================================================== */
  it('devrait appeler userService.register() si le formulaire est valide', () => {
    userServiceMock.register.mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@test.com',
      password: '123456'
    });

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@test.com',
      password: '123456'
    });
  });

  /* ===========================================================================
     TEST : POPUP APRÈS SUCCÈS (onSubmit + showPopup / popupType)
     =========================================================================== */
  it('devrait afficher le popup succès après un register réussi', () => {
    userServiceMock.register.mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'Marie',
      lastName: 'Durand',
      login: 'marie@test.com',
      password: 'abcdef'
    });

    component.onSubmit();

    expect(component.showPopup).toBe(true);
    expect(component.popupType).toBe('success');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  /* ===========================================================================
     TEST : REDIRECTION LORSQUE closePopup() EST APPELÉ (cas succès)
     =========================================================================== */
  it('devrait rediriger vers /login lorsqu’on ferme le popup succès', () => {
    component.showPopup = true;
    component.popupType = 'success';

    component.closePopup();

    expect(component.showPopup).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  /* ===========================================================================
     TEST : ERREUR API → popup erreur, sans redirection
     =========================================================================== */
  it('devrait afficher le popup erreur si register échoue', () => {
    userServiceMock.register.mockReturnValue(
      throwError(() => new Error('Erreur API'))
    );

    component.registerForm.setValue({
      firstName: 'Test',
      lastName: 'Erreur',
      login: 'x',
      password: 'y'
    });

    component.onSubmit();

    expect(component.showPopup).toBe(true);
    expect(component.popupType).toBe('error');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  /* ===========================================================================
     TEST : RESET DU FORMULAIRE
     =========================================================================== */
  it('devrait réinitialiser le formulaire lors de onReset()', () => {
    component.submitted = true;

    component.registerForm.setValue({
      firstName: 'A',
      lastName: 'B',
      login: 'C',
      password: 'D'
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.value).toEqual({
      firstName: null,
      lastName: null,
      login: null,
      password: null
    });
  });

});
