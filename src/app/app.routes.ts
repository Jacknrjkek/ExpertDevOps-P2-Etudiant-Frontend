import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/students/student-list.component').then(m => m.StudentListComponent)
  },
  {
    path: 'students/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/students/student-create.component').then(m => m.StudentCreateComponent)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
