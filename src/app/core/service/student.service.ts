import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ---------------------------------------------------------------------------
// MODÈLE : Représentation d'un étudiant (structure renvoyée par le backend)
// ---------------------------------------------------------------------------
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root' // Service injecté automatiquement dans toute l'application
})
export class StudentService {

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------------------------
  // RÉCUPÉRATION DE TOUS LES ÉTUDIANTS
  // GET : /api/students
  // Renvoie la liste complète sous forme d'Observable<Student[]>
  // ---------------------------------------------------------------------------
  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>('/api/students');
  }

  // ---------------------------------------------------------------------------
  // RÉCUPÉRATION D'UN ÉTUDIANT PAR ID
  // GET : /api/students/{id}
  // ---------------------------------------------------------------------------
  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`/api/students/${id}`);
  }

  // ---------------------------------------------------------------------------
  // CRÉATION D'UN NOUVEL ÉTUDIANT
  // POST : /api/students
  // Envoie un objet Student (sans id)
  // ---------------------------------------------------------------------------
  create(student: Student): Observable<void> {
    return this.http.post<void>('/api/students', student);
  }

  // ---------------------------------------------------------------------------
  // MISE À JOUR D'UN ÉTUDIANT EXISTANT
  // PUT : /api/students/{id}
  // ---------------------------------------------------------------------------
  update(id: number, student: Student): Observable<void> {
    return this.http.put<void>(`/api/students/${id}`, student);
  }

  // ---------------------------------------------------------------------------
  // SUPPRESSION D'UN ÉTUDIANT
  // DELETE : /api/students/{id}
  // ---------------------------------------------------------------------------
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/students/${id}`);
  }
}
