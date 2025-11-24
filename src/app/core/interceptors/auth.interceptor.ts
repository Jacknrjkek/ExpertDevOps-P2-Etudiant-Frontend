import { HttpInterceptorFn } from '@angular/common/http';

// -----------------------------------------------------------------------------
// INTERCEPTOR D'AUTHENTIFICATION (JWT)
// -----------------------------------------------------------------------------
// Rôle :
// - Intercepter toutes les requêtes HTTP sortantes de l'application.
// - Lire le Token JWT stocké dans le localStorage.
// - Si un token existe, ajouter automatiquement l'en-tête
//     Authorization: Bearer <token>
//   à la requête HTTP avant son envoi.
//
// Avantage :
// - Plus besoin d'ajouter manuellement le token dans chaque service.
// - Centralise la sécurité et simplifie le code.
// -----------------------------------------------------------------------------

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Récupération du Token stocké dans le localStorage après login
  const token = localStorage.getItem('token');

  // Si un token existe, on clone la requête pour ajouter l'en-tête Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Format standard des tokens JWT
      }
    });
  }

  // Passe la requête (modifiée ou non) au prochain handler de la chaîne HTTP
  return next(req);
};
