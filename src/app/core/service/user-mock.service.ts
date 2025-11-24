import { Register } from '../models/Register';
import { Observable, of } from 'rxjs';

export class UserMockService {

  // ---------------------------------------------------------------------------
  // VERSION MOCK DU REGISTER
  // Ne fait aucun appel réel, renvoie simplement un Observable vide.
  // Utile pour les tests ou le développement sans backend actif.
  // ---------------------------------------------------------------------------
  register(user: Register): Observable<Object> {
    return of();
  }
}
