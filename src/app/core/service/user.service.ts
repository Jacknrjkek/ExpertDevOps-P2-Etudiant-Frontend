import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service globalement disponible dans toute l'application
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  // ---------------------------------------------------------------------------
  // INSCRIPTION D'UN UTILISATEUR
  // Envoie un objet "Register" au backend via POST.
  // Retourne un Observable contenant la réponse de l'API.
  // ---------------------------------------------------------------------------
  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  // ---------------------------------------------------------------------------
  // AUTHENTIFICATION / LOGIN
  // Envoie les identifiants {login, password} au backend.
  // Le backend renvoie normalement un Token JWT.
  // ---------------------------------------------------------------------------
  login(credentials: { login: string; password: string }): Observable<Object> {
    return this.httpClient.post('/api/login', credentials);
  }
}
