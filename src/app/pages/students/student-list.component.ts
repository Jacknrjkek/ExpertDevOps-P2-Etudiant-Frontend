import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService, Student } from '../../core/service/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  private studentService = inject(StudentService);
  private router = inject(Router);

  students: Student[] = [];

  ngOnInit() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students = data
    });
  }

  createStudent() {
    this.router.navigate(['/students/create']);
  }

  view(id: number) {
    this.router.navigate(['/students', id]);
  }

  edit(id: number) {
    this.router.navigate(['/students', id, 'edit']);
  }

  delete(id: number) {
    if (confirm('Supprimer cet étudiant ?')) {
      this.studentService.delete(id).subscribe({
        next: () => this.students = this.students.filter(s => s.id !== id)
      });
    }
  }
}
