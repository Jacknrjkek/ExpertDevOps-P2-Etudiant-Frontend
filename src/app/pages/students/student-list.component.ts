import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService, Student } from '../../core/service/student.service';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, AfterViewInit {

  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);
  private router = inject(Router); // Reste injecté pour le logout

  students: Student[] = [];

  createForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  editForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  private createModal: any;
  private editModal: any;

  private currentEditId: number | null = null;


  ngOnInit() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students = data
    });
  }

  ngAfterViewInit() {
    const createEl = document.getElementById('createModal');
    const editEl = document.getElementById('editModal');

    this.createModal = new bootstrap.Modal(createEl!);
    this.editModal = new bootstrap.Modal(editEl!);
  }


  /* ====== CREATE ====== */

  openCreateModal() {
    this.createForm.reset();
    this.createModal.show();
  }

  submitCreate() {
    if (this.createForm.invalid) return;

    this.studentService.create(this.createForm.value as any).subscribe({
      next: () => {
        this.createModal.hide();
        this.reloadStudents();
      },
      error: () => alert("Erreur lors de la création.")
    });
  }


  /* ====== EDIT ====== */

  openEditModal(student: Student) {
    this.currentEditId = student.id!;
    this.editForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email
    });
    this.editModal.show();
  }

  submitUpdate() {
    if (this.editForm.invalid || this.currentEditId == null) return;

    this.studentService.update(this.currentEditId, this.editForm.value as any).subscribe({
      next: () => {
        this.editModal.hide();
        this.reloadStudents();
      },
      error: () => alert("Erreur lors de la mise à jour.")
    });
  }


  /* ====== DELETE ====== */

  delete(id: number) {
    if (!confirm('Supprimer cet étudiant ?')) return;

    this.studentService.delete(id).subscribe({
      next: () => this.students = this.students.filter(s => s.id !== id)
    });
  }


  /* ====== RELOAD LIST ====== */

  private reloadStudents() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students = data
    });
  }

  /* ====== LOGOUT ====== */

  logout() {
    // Supprime le token et redirige vers l'accueil
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}