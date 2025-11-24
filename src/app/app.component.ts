import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  // Point d'ancrage : Balise utilisée dans le index.html pour démarrer l'app
  selector: 'app-root',
  templateUrl: './app.component.html',

  // ARCHITECTURE STANDALONE : On importe directement ce dont on a besoin
  imports: [
    // NAVIGATION : C'est l'espace réservé où s'afficheront les pages (Login, Home, etc.)
    // Sans ça, le changement d'URL ne changerait pas la vue.
    RouterOutlet
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  // C'est le composant "Racine" (Root) : Le parent de tous les autres composants
  title = 'etudiant-frontend';
}