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
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  // ---------------------------------------------------------------------------
  // PROPRIÉTÉS DU COMPOSANT
  // - registerForm : structure du formulaire réactif
  // - submitted : indique si l’utilisateur a tenté une soumission
  // ---------------------------------------------------------------------------
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  // ---------------------------------------------------------------------------
  // POPUP : état + type ('success' ou 'error')
  // ---------------------------------------------------------------------------
  showPopup = false;
  popupType: 'success' | 'error' = 'success';

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

  // Getter pratique pour accéder aux contrôles dans le template
  get form() {
    return this.registerForm.controls;
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Soumission du formulaire
  // 1. Active "submitted"
  // 2. Vérifie la validité
  // 3. Construit l’objet Register
  // 4. Appelle le backend via UserService.register()
  // 5. En cas de succès → popup succès ; en cas d’erreur → popup erreur
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
          // Popup succès
          this.popupType = 'success';
          this.showPopup = true;
        },
        error: (err) => {
          console.error('Erreur inscription :', err);
          // Popup erreur
          this.popupType = 'error';
          this.showPopup = true;
        }
      });
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Fermeture du popup
  // - Si succès → redirection vers /login
  // - Si erreur → on reste sur la page
  // ---------------------------------------------------------------------------
  closePopup(): void {
    this.showPopup = false;
    if (this.popupType === 'success') {
      this.router.navigate(['/login']);
    }
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Réinitialisation du formulaire
  // ---------------------------------------------------------------------------
  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Navigation vers Home
  // ---------------------------------------------------------------------------
  goHome(): void {
    this.router.navigate(['/home']);
  }
}
