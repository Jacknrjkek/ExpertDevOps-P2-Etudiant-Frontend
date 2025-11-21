import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  // Liste étudiants (avec popups)
  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/students/student-list.component')
        .then(m => m.StudentListComponent)
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];
