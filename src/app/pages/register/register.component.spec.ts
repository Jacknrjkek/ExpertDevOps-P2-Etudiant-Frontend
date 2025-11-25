import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

/**
 * ===========================================================================
 * PATCH POUR LES TESTS :
 * - jsdom ne connaît pas alert() → on le mocke ici pour éviter les warnings
 * ===========================================================================
 */

(global as any).alert = jest.fn();

/**
 * ===========================================================================
 * TESTS UNITAIRES DU COMPOSANT : RegisterComponent
 * ===========================================================================
 * Objectifs :
 * - Vérifier la logique du formulaire d’inscription
 * - Vérifier l’appel du UserService
 * - Vérifier la redirection après succès
 *
 * Notes :
 * - Le MaterialModule n’est pas mocké (pas nécessaire pour les tests unitaires)
 * - On mocke le UserService pour éviter un appel réel HTTP
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,       // composant standalone
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // ngOnInit()
  });

  /* ===========================================================================
     TEST DE BASE : LE COMPOSANT EXISTE
     =========================================================================== */

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  /* ===========================================================================
     FORMULAIRE : VALIDATION
     =========================================================================== */

  it('le formulaire devrait être invalide lorsqu’il est vide', () => {
    expect(component.registerForm.invalid).toBe(true);
  });

  /* ===========================================================================
     SOUMISSION DU FORMULAIRE
     =========================================================================== */

  it('devrait appeler userService.register() si le formulaire est valide', () => {
    // Mock retour API
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
     REDIRECTION APRÈS SUCCÈS
     =========================================================================== */

  it('devrait rediriger vers /login après un register réussi', () => {
    userServiceMock.register.mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'Marie',
      lastName: 'Durand',
      login: 'marie@test.com',
      password: 'abcdef'
    });

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  /* ===========================================================================
     RESET FORMULAIRE
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
