/**
 * ============================================================================
 * TEST E2E : Écran de connexion (Login)
 * ============================================================================
 * Objectifs :
 * - Vérifier l’affichage général de la page
 * - Remplir et valider le formulaire de connexion
 * - Mock de l’API pour isoler le front-end
 * - Vérifier la navigation, le stockage du token, et gestion du popup (succès / erreur)
 * ============================================================================
 */

describe('Écran de connexion – Tests E2E', () => {

  beforeEach(() => {
    // -------------------------------------------------------------------------
    // Mock de la route POST /api/login pour éviter un vrai backend
    // -------------------------------------------------------------------------
    cy.intercept(
      'POST',
      '/api/login',
      { statusCode: 200, body: { token: 'FAKE_JWT' } }
    ).as('loginRequest');

    // -------------------------------------------------------------------------
    // Visite de la page de login
    // -------------------------------------------------------------------------
    cy.visit('/login');
  });

  // ---------------------------------------------------------------------------
  // Vérification de l’affichage général
  // ---------------------------------------------------------------------------
  it('devrait afficher la page de connexion', () => {
    cy.contains('Formulaire de connexion');
    cy.get('input[formControlName="login"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
  });

  // ---------------------------------------------------------------------------
  // Refuser la soumission si le formulaire est vide
  // ---------------------------------------------------------------------------
  it('ne devrait pas soumettre si les champs sont vides', () => {
    cy.contains('Se connecter').click();
    cy.contains("L’identifiant est requis").should('exist');
    cy.contains("Le mot de passe est requis").should('exist');
    cy.get('@loginRequest.all').should('have.length', 0);
  });

  // ---------------------------------------------------------------------------
  // Connexion OK : mock API, token localStorage, popup succès, fermeture, redirection
  // ---------------------------------------------------------------------------
  it('devrait permettre une connexion valide, afficher le popup succès, fermer le popup, stocker le token et rediriger', () => {
    cy.get('input[formControlName="login"]').type('jean');
    cy.get('input[formControlName="password"]').type('1234');
    cy.contains('Se connecter').click();
    cy.wait('@loginRequest');

    // Vérifie que le popup apparaît
    cy.get('.popup-overlay').should('be.visible');
    cy.get('.popup-box .popup-title').should('contain.text', 'Connexion réussie');
    cy.get('.popup-btn').click(); // Fermeture du popup

    // Vérification du stockage du token
    cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.equal('FAKE_JWT');
    });

    // Vérification de la redirection
    cy.url().should('include', '/students');
  });

  // ---------------------------------------------------------------------------
  // Gestion d’erreur : identifiants invalides → mock erreur + popup d’erreur
  // ---------------------------------------------------------------------------
  it('devrait afficher un popup erreur si le backend renvoie une erreur', () => {
    cy.intercept(
      'POST',
      '/api/login',
      { statusCode: 401, body: { message: 'Bad credentials' } }
    ).as('loginFail');

    cy.get('input[formControlName="login"]').type('wrong');
    cy.get('input[formControlName="password"]').type('wrong');
    cy.contains('Se connecter').click();
    cy.wait('@loginFail');

    // Vérifie que le popup d'erreur apparaît
    cy.get('.popup-overlay').should('be.visible');
    cy.get('.popup-box .popup-error-title').should('contain.text', 'Échec de connexion');
    cy.get('.popup-box p').should('contain.text', 'Identifiant ou mot de passe incorrect.');
    cy.get('.popup-btn').click(); // Fermeture du popup

    // On reste sur /login
    cy.url().should('include', '/login');
  });

  // ---------------------------------------------------------------------------
  // Bouton "Effacer" → reset du formulaire
  // ---------------------------------------------------------------------------
  it('devrait réinitialiser le formulaire via le bouton Effacer', () => {
    cy.get('input[formControlName="login"]').type('aaa');
    cy.get('input[formControlName="password"]').type('bbb');
    cy.contains('Effacer').click();
    cy.get('input[formControlName="login"]').should('have.value', '');
    cy.get('input[formControlName="password"]').should('have.value', '');
  });

  // ---------------------------------------------------------------------------
  // Bouton "Accueil" → navigation vers /home
  // ---------------------------------------------------------------------------
  it('devrait rediriger vers /home via le bouton Accueil', () => {
    cy.contains('Accueil').click();
    cy.url().should('include', '/home');
  });
});
