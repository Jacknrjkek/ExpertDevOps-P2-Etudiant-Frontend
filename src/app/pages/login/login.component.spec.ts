import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * ===========================================================================
 * PATCH POUR LES TESTS :
 * - jsdom ne connaît pas alert() → on le mocke ici
 * ===========================================================================
 */

(global as any).alert = jest.fn();

/**
 * ===========================================================================
 * TESTS UNITAIRES DU COMPOSANT : LoginComponent
 * ===========================================================================
 * Objectifs :
 * - Vérifier le comportement du formulaire de connexion
 * - Vérifier que UserService est correctement appelé
 * - Vérifier les redirections et le stockage du token
 *
 * Ce que l’on NE teste PAS :
 * - L’affichage visuel du template
 * - Les erreurs API complexes
 * - Le comportement du MaterialModule (hors périmètre)
 *
 * Outils :
 * - Jest : mocks, assertions
 * - TestBed : simulation du contexte Angular
 * ===========================================================================
 */

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // ---------------------------------------------------------------------------
  // Mock du UserService :
  // - login() renvoie un Observable simulé
  // - sera personnalisé dans chaque test
  // ---------------------------------------------------------------------------
  const userServiceMock = {
    login: jest.fn()
  };

  // Mock du Router pour éviter une vraie navigation
  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,          // Composant standalone
        ReactiveFormsModule      // Requis pour le formulaire réactif
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche ngOnInit
  });

  /* ===========================================================================
     SECTION : INITIALISATION DU FORMULAIRE
     =========================================================================== */

  it('devrait initialiser un formulaire invalide au démarrage', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  /* ===========================================================================
     SECTION : VALIDATION / SOUMISSION
     =========================================================================== */

  it('ne devrait PAS appeler userService.login() si le formulaire est invalide', () => {
    component.onSubmit();

    expect(userServiceMock.login).not.toHaveBeenCalled();
  });

  it('devrait appeler userService.login() avec les bonnes valeurs si le formulaire est valide', () => {
    // Remplissage du formulaire
    component.loginForm.setValue({
      login: 'testuser',
      password: '123456'
    });

    // Mock retour API
    userServiceMock.login.mockReturnValue(of({ token: 'abc123' }));

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith({
      login: 'testuser',
      password: '123456'
    });
  });

  /* ===========================================================================
     SECTION : STOCKAGE DU TOKEN + REDIRECTION
     =========================================================================== */

  it('devrait stocker le token et rediriger vers /students en cas de succès', () => {
    component.loginForm.setValue({
      login: 'john',
      password: 'doe'
    });

    // Mock retour API
    userServiceMock.login.mockReturnValue(of({ token: 'jwt_token' }));

    // Mock explicite de localStorage.setItem()
    const setItemMock = jest.fn();

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: setItemMock,
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    component.onSubmit();

    expect(setItemMock).toHaveBeenCalledWith('token', 'jwt_token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  /* ===========================================================================
     SECTION : CAS D’ÉCHEC (identifiants incorrects)
     =========================================================================== */

  it('devrait afficher une erreur si le login échoue', () => {
    component.loginForm.setValue({
      login: 'wrong',
      password: 'wrong'
    });

    // Mock erreur API
    userServiceMock.login.mockReturnValue(throwError(() => new Error()));

    // Espion console.error pour éviter pollution logs
    jest.spyOn(console, 'error').mockImplementation(() => null);

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalled();
  });

  /* ===========================================================================
     SECTION : RESET FORMULAIRE
     =========================================================================== */

  it('devrait réinitialiser submitted et le formulaire lors de onReset()', () => {
    component.submitted = true;
    component.loginForm.setValue({ login: 'x', password: 'y' });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.loginForm.value).toEqual({ login: null, password: null });
  });

  /* ===========================================================================
     SECTION : NAVIGATION HOME
     =========================================================================== */

  it('devrait rediriger vers /home lors de goHome()', () => {
    component.goHome();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

});
