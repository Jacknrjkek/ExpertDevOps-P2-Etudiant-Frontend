import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Register } from '../../core/models/Register';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  // ---------------------------------------------------------------------------
  // INJECTIONS DE DÉPENDANCES
  // Services nécessaires au formulaire, navigation, API et nettoyage automatique.
  // ---------------------------------------------------------------------------
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef); // détruit automatiquement les subscriptions
  private router = inject(Router);

  // ---------------------------------------------------------------------------
  // PROPRIÉTÉS DU COMPOSANT
  // - registerForm : structure du formulaire réactif
  // - submitted : indique si une tentative d’envoi a été effectuée
  // ---------------------------------------------------------------------------
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  // ---------------------------------------------------------------------------
  // NOUVEAU : popup succès (affiché uniquement quand l'inscription fonctionne)
  // ---------------------------------------------------------------------------
  showPopup = false;

  // ---------------------------------------------------------------------------
  // INITIALISATION DU FORMULAIRE
  // Tous les champs sont obligatoires pour l'inscription.
  // ---------------------------------------------------------------------------
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Getter pour simplifier l’accès au template HTML
  get form() {
    return this.registerForm.controls;
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Soumission du formulaire
  // 1. Active "submitted" pour afficher les erreurs
  // 2. Vérifie la validité du formulaire
  // 3. Construit l'objet Register conformément au modèle
  // 4. Appelle l’API d’inscription
  // 5. Affiche un popup en cas de succès
  // ---------------------------------------------------------------------------
  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const registerUser: Register = {
      firstName: this.form['firstName'].value,
      lastName: this.form['lastName'].value,
      login: this.form['login'].value,
      password: this.form['password'].value
    };

    this.userService.register(registerUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Popup succès (remplace SUCCESS!! :-) )
          this.showPopup = true;
        },
        error: (err) => {
          console.error('Erreur inscription :', err);
          alert('Impossible de finaliser l’inscription.');
        }
      });
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Fermeture du popup
  // Redirige l’utilisateur vers la page de connexion
  // ---------------------------------------------------------------------------
  closePopup() {
    this.showPopup = false;
    this.router.navigate(['/login']);
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Réinitialisation du formulaire
  // ---------------------------------------------------------------------------
  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Retour à Home
  // ---------------------------------------------------------------------------
  goHome() {
    this.router.navigate(['/home']);
  }
}
