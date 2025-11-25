import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

/**
 * ===========================================================================
 * TESTS UNITAIRES DU COMPOSANT : HomeComponent
 * ===========================================================================
 * Objectifs :
 * - Vérifier que les méthodes de navigation appellent correctement Router
 * - Aucune logique métier, DOM ou service externe à tester
 *
 * Outils :
 * - Jest : mocks + assertions
 * - TestBed : instanciation propre du composant
 * ===========================================================================
 */

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Mock du Router utilisé dans le composant
  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent], // composant standalone
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ===========================================================================
     SECTION : NAVIGATION LOGIN
     =========================================================================== */

  it('devrait naviguer vers /login lorsque goToLogin() est appelé', () => {
    component.goToLogin();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  /* ===========================================================================
     SECTION : NAVIGATION REGISTER
     =========================================================================== */

  it('devrait naviguer vers /register lorsque goToRegister() est appelé', () => {
    component.goToRegister();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });

});
