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
  // Services nécessaires au formulaire, navigation, API et destruction.
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

  // Getter pour simplifier l’accès au template
  get form() {
    return this.registerForm.controls;
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Soumission du formulaire
  // 1. Active "submitted"
  // 2. Vérifie la validité
  // 3. Envoie l'objet Register au backend
  // 4. Redirige vers la page Login en cas de succès
  // ---------------------------------------------------------------------------
  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    // Création de l'objet conforme au modèle 'Register'
    const registerUser: Register = {
      firstName: this.form['firstName'].value,
      lastName: this.form['lastName'].value,
      login: this.form['login'].value,
      password: this.form['password'].value
    };

    // Appel Backend + nettoyage automatique
    this.userService.register(registerUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {

        // Confirmation simple
        alert('SUCCESS!! :-)');

        // Redirection vers la page Login
        this.router.navigate(['/login']);
      });
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Réinitialisation du formulaire
  // ---------------------------------------------------------------------------
  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }

  // ---------------------------------------------------------------------------
  // MÉTHODE : Retour à la Home
  // ---------------------------------------------------------------------------
  goHome() {
    this.router.navigate(['/home']);
  }
}
