import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>('/api/students');
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`/api/students/${id}`);
  }

  create(student: Student): Observable<void> {
    return this.http.post<void>('/api/students', student);
  }

  update(id: number, student: Student): Observable<void> {
    return this.http.put<void>(`/api/students/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/students/${id}`);
  }
}
