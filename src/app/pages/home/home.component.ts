import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // INJECTION DE DÉPENDANCE :
  // On injecte le service 'Router' pour pouvoir naviguer via le code (TypeScript)
  // plutôt que via des liens href classiques.
  constructor(private router: Router) {}

  // Méthodes de navigation programmatique
  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}