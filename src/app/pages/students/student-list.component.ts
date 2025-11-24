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

  // ---------------------------------------------------------------------------
  // INJECTIONS DE DÉPENDANCES
  // - StudentService : communication avec l'API backend
  // - FormBuilder : création de formulaires réactifs
  // - Router : utilisé ici uniquement pour le logout
  // ---------------------------------------------------------------------------
  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Tableau contenant la liste des étudiants récupérés depuis le backend
  students: Student[] = [];

  // ---------------------------------------------------------------------------
  // FORMULAIRES RÉACTIFS
  // 'createForm' : formulaire utilisé dans le modal de création
  // 'editForm'   : formulaire utilisé dans le modal d'édition
  // ---------------------------------------------------------------------------
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

  // Références des modals Bootstrap (initialisées dans AfterViewInit)
  private createModal: any;
  private editModal: any;

  // ID de l’étudiant actuellement en cours d’édition
  private currentEditId: number | null = null;

  // ---------------------------------------------------------------------------
  // INITIALISATION DES DONNÉES
  // Appel API pour charger tous les étudiants au démarrage du composant
  // ---------------------------------------------------------------------------
  ngOnInit() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students = data
    });
  }

  // ---------------------------------------------------------------------------
  // INITIALISATION DES MODALS (Bootstrap)
  // Ne peut être fait qu’après affichage du DOM (AfterViewInit)
  // ---------------------------------------------------------------------------
  ngAfterViewInit() {
    const createEl = document.getElementById('createModal');
    const editEl = document.getElementById('editModal');

    // Instanciation des modals Bootstrap
    this.createModal = new bootstrap.Modal(createEl!);
    this.editModal = new bootstrap.Modal(editEl!);
  }

  /* ===========================================================================
     SECTION : CRÉATION D'ÉTUDIANT
     =========================================================================== */

  // Ouvre le modal de création et réinitialise le formulaire
  openCreateModal() {
    this.createForm.reset();
    this.createModal.show();
  }

  // Envoi du formulaire de création
  submitCreate() {
    if (this.createForm.invalid) return;

    this.studentService.create(this.createForm.value as any).subscribe({
      next: () => {
        this.createModal.hide();
        this.reloadStudents(); // Recharge la liste après création
      },
      error: () => alert("Erreur lors de la création.")
    });
  }

  /* ===========================================================================
     SECTION : MODIFICATION D'ÉTUDIANT
     =========================================================================== */

  // Ouvre le modal d’édition et pré-remplit les champs avec les valeurs existantes
  openEditModal(student: Student) {
    this.currentEditId = student.id!;
    this.editForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email
    });
    this.editModal.show();
  }

  // Envoi du formulaire de mise à jour
  submitUpdate() {
    if (this.editForm.invalid || this.currentEditId == null) return;

    this.studentService.update(this.currentEditId, this.editForm.value as any).subscribe({
      next: () => {
        this.editModal.hide();
        this.reloadStudents(); // Mise à jour de l’affichage
      },
      error: () => alert("Erreur lors de la mise à jour.")
    });
  }

  /* ===========================================================================
     SECTION : SUPPRESSION D'ÉTUDIANT
     =========================================================================== */

  // Suppression d'un étudiant après confirmation
  delete(id: number) {
    if (!confirm('Supprimer cet étudiant ?')) return;

    this.studentService.delete(id).subscribe({
      next: () => this.students = this.students.filter(s => s.id !== id)
    });
  }

  /* ===========================================================================
     SECTION : RAFRAÎCHISSEMENT DE LA LISTE
     =========================================================================== */

  // Recharge tous les étudiants depuis le backend
  private reloadStudents() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students = data
    });
  }

  /* ===========================================================================
     SECTION : LOGOUT
     =========================================================================== */

  // Déconnexion : supprime le token et renvoie à la page d’accueil
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}
