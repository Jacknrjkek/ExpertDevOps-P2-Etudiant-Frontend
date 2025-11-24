import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// -----------------------------------------------------------------------------
// GUARD D'AUTHENTIFICATION
// -----------------------------------------------------------------------------
// Rôle :
// - Protéger l'accès à certaines routes (ex. : /students)
// - Vérifier si un Token JWT est présent dans le localStorage
// - Si aucun token n'est trouvé, l'utilisateur est redirigé vers /login
//
// Fonctionnement :
// Le guard est exécuté AVANT l'activation d'une route.
// Si la fonction renvoie "true", l'accès est autorisé.
// Si elle renvoie une UrlTree, Angular redirige automatiquement.
//
// Avantages :
// - Empêche les utilisateurs non authentifiés d'accéder aux pages protégées
// - S'intègre parfaitement avec l'interceptor JWT pour une sécurité complète
// -----------------------------------------------------------------------------

export const authGuard: CanActivateFn = (route, state) => {

  // Injection du Router dans une fonction (sans classe)
  const router = inject(Router);

  // Vérification de la présence du Token JWT
  const token = localStorage.getItem('token');

  // ---------------------------------------------------------------------------
  // Si aucun token n’est présent :
  // - On empêche l’accès à la route protégée
  // - On redirige l’utilisateur vers la page de login
  // ---------------------------------------------------------------------------
  if (!token) {
    return router.parseUrl('/login');
  }

  // Si un token existe, l’accès est autorisé
  return true;
};
