import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService, Student } from '../../core/service/student.service';

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

  students: Student[] = [];

  createForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  private createModal: any;

  ngOnInit() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students = data
    });
  }

  ngAfterViewInit() {
    const modalEl = document.getElementById('createModal');
    this.createModal = new bootstrap.Modal(modalEl!);
  }

  openCreateModal() {
    this.createForm.reset();
    this.createModal.show();
  }

  submitCreate() {
    if (this.createForm.invalid) return;

    this.studentService.create(this.createForm.value as any).subscribe({
      next: () => {
        this.createModal.hide();
        this.studentService.getAll().subscribe({
          next: (data) => this.students = data
        });
      },
      error: () => alert("Erreur lors de la création.")
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cet étudiant ?')) return;

    this.studentService.delete(id).subscribe({
      next: () => this.students = this.students.filter(s => s.id !== id)
    });
  }

}
