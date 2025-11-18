import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {

  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);

  submitted = false;

  createForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required]
  });

  get form() {
    return this.createForm.controls;
  }

goBack() {
  this.router.navigate(['/students']);
}

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.createForm.invalid) return;

    this.studentService.create(this.createForm.value as any).subscribe({
      next: () => {
        alert('Étudiant créé !');
        this.router.navigate(['/students']);
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.createForm.reset();
  }
}
