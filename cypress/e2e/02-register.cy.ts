/**
 * ============================================================================
 * TEST E2E : Écran d'inscription (RegisterComponent)
 * ============================================================================
 * Objectifs :
 * - Vérifier l’affichage du formulaire
 * - Tester les validations Angular (4 champs obligatoires)
 * - Mock des appels API pour isoler le front-end
 * - Vérifier le comportement attendu : succès, popup, reset, navigation, gestion d’erreur
 * ============================================================================
 */

describe('Écran d’inscription – Tests E2E', () => {

  // ---------------------------------------------------------------------------
  // Utilitaire : fait le setup avant chaque test
  // ---------------------------------------------------------------------------
  beforeEach(() => {
    // On mocke l’API register (réponse 200 par défaut)
    cy.intercept('POST', '/api/register', { statusCode: 200, body: { message: 'OK' } })
      .as('registerRequest');

    // On visite la page d'inscription
    cy.visit('/register');
  });

  // ---------------------------------------------------------------------------
  // 1. Vérification des éléments du formulaire
  // ---------------------------------------------------------------------------
  it('devrait afficher correctement la page d’inscription', () => {
    cy.contains("Formulaire d'inscription");
    cy.get('input[formControlName="firstName"]').should('exist');
    cy.get('input[formControlName="lastName"]').should('exist');
    cy.get('input[formControlName="login"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
  });

  // ---------------------------------------------------------------------------
  // 2. Formulaire vide → erreurs de validation
  // ---------------------------------------------------------------------------
  it('ne devrait PAS soumettre si les champs sont vides', () => {
    cy.contains("S'inscrire").click();

    cy.contains('Le prénom est requis').should('exist');
    cy.contains('Le nom est requis').should('exist');
    cy.contains("L’identifiant est requis").should('exist');
    cy.contains('Le mot de passe est requis').should('exist');

    cy.get('@registerRequest.all').should('have.length', 0);
  });

  // ---------------------------------------------------------------------------
  // 3. Soumission valide → popup succès → fermeture → redirection /login
  // ---------------------------------------------------------------------------
  it('devrait inscrire un utilisateur valide, afficher le popup succès, le fermer et rediriger vers /login', () => {
    cy.get('input[formControlName="firstName"]').type('Jean');
    cy.get('input[formControlName="lastName"]').type('Dupont');
    cy.get('input[formControlName="login"]').type('jeandp');
    cy.get('input[formControlName="password"]').type('1234');
    cy.contains("S'inscrire").click();

    cy.wait('@registerRequest')
      .its('request.body')
      .should('deep.equal', {
        firstName: 'Jean',
        lastName: 'Dupont',
        login: 'jeandp',
        password: '1234'
      });

    // Vérification du popup succès
    cy.get('.popup-overlay').should('be.visible');
    cy.get('.popup-box .popup-title')
      .should('contain.text', 'Inscription réussie');
    cy.get('.popup-btn').click();

    // Après fermeture : redirection vers /login
    cy.url().should('include', '/login');
  });

 // 4. Gestion d’erreur API → popup erreur, fermeture, on reste sur /register
it('devrait afficher un popup erreur si le backend renvoie une erreur', () => {
  // On remplace le mock pour renvoyer une erreur HTTP 400
  cy.intercept('POST', '/api/register', {
    statusCode: 400,
    body: { message: 'Login exists' }
  }).as('registerError');

  // Remplissage du formulaire
  cy.get('input[formControlName="firstName"]').type('Jean');
  cy.get('input[formControlName="lastName"]').type('Dupont');
  cy.get('input[formControlName="login"]').type('jeandp');
  cy.get('input[formControlName="password"]').type('1234');

  // Soumission
  cy.contains("S'inscrire").click();

  // On attend la requête
  cy.wait('@registerError');

  // Vérification du popup erreur
  cy.get('.popup-overlay').should('be.visible');
  cy.get('.popup-box .popup-error-title')
    .should('contain.text', 'Identifiant déjà utilisé.');
  cy.get('.popup-box p')
    .should('contain.text', 'Veuillez réessayer avec un autre identifiant.');

  // Fermeture du popup
  cy.get('.popup-btn').click();

  // On vérifie qu’on reste sur /register
  cy.url().should('include', '/register');
});

  // ---------------------------------------------------------------------------
  // 5. Bouton Reset → réinitialise les valeurs
  // ---------------------------------------------------------------------------
  it('devrait réinitialiser le formulaire via le bouton Effacer', () => {
    cy.get('input[formControlName="firstName"]').type('A');
    cy.get('input[formControlName="lastName"]').type('B');
    cy.get('input[formControlName="login"]').type('C');
    cy.get('input[formControlName="password"]').type('D');

    cy.contains('Effacer').click();

    cy.get('input[formControlName="firstName"]').should('have.value', '');
    cy.get('input[formControlName="lastName"]').should('have.value', '');
    cy.get('input[formControlName="login"]').should('have.value', '');
    cy.get('input[formControlName="password"]').should('have.value', '');
  });

  // ---------------------------------------------------------------------------
  // 6. Bouton Home → redirection /home
  // ---------------------------------------------------------------------------
  it('devrait rediriger vers /home via le bouton Accueil', () => {
    cy.contains('Accueil').click();
    cy.url().should('include', '/home');
  });

});
