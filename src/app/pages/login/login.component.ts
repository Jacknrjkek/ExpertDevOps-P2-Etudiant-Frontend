import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // ---------------------------------------------------------------------------
  // INJECTION DES DÉPENDANCES
  // Toutes les dépendances sont injectées via la fonction 'inject()'
  // plutôt que via un constructeur (nouvelle approche Angular).
  // ---------------------------------------------------------------------------
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef); // Permet de nettoyer automatiquement les subscriptions
  private router = inject(Router);

  // ---------------------------------------------------------------------------
  // PROPRIÉTÉS DU COMPOSANT
  // 'loginForm' contient les champs du formulaire.
  // 'submitted' sert à afficher l’état du formulaire après tentative d’envoi.
  // ---------------------------------------------------------------------------
  loginForm: FormGroup = new FormGroup({});
  submitted = false;

  // ---------------------------------------------------------------------------
  // POPUP : État + type ('success' ou 'error')
  // ---------------------------------------------------------------------------
  showPopup = false;
  popupType: 'success' | 'error' = 'success';

  // ---------------------------------------------------------------------------
  // INITIALISATION DU FORMULAIRE
  // ---------------------------------------------------------------------------
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Getter pratique pour accéder aux contrôles dans le template
  get form() {
    return this.loginForm.controls;
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Soumission du formulaire
  // 1. Active l'état "submitted"
  // 2. Vérifie la validité du formulaire
  // 3. Envoie les identifiants au backend via UserService
  // ---------------------------------------------------------------------------
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    const payload = {
      login: this.form['login'].value,
      password: this.form['password'].value
    };

    this.userService.login(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {

          console.log('Réponse backend =', res);

          if (res?.token) {
            localStorage.setItem('token', res.token);
            console.log('Token stocké =', res.token);
          } else {
            console.error(' Aucun token renvoyé !');
          }

          // POPUP SUCCÈS
          this.popupType = 'success';
          this.showPopup = true;
        },

        // POPUP ERREUR
        error: (err) => {
          console.error('Erreur login :', err);

          this.popupType = 'error';
          this.showPopup = true;
        }
      });
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Fermeture du popup
  // - Si succès → redirection
  // - Si erreur → on ferme juste
  // ---------------------------------------------------------------------------
  closePopup() {
    this.showPopup = false;

    if (this.popupType === 'success') {
      this.router.navigate(['/students']);
    }
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Réinitialisation du formulaire
  // ---------------------------------------------------------------------------
  onReset() {
    this.submitted = false;
    this.loginForm.reset();
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Navigation vers Home
  // ---------------------------------------------------------------------------
  goHome() {
    this.router.navigate(['/home']);
  }
}
