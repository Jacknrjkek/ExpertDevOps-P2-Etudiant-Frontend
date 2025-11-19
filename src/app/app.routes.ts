import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/students/student-list.component')
        .then(m => m.StudentListComponent)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
