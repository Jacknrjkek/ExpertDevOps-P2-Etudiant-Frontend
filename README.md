# 🎓 Système de Gestion des Étudiants (Frontend)

![Angular](https://img.shields.io/badge/Angular-19.2.16-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Latest_LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)

Interface utilisateur moderne pour l'application de gestion des étudiants. Développée avec Angular 19, cette application permet aux agents de la bibliothèque de gérer facilement les inscrits et leurs emprunts.

---

## 🚀 Fonctionnalités

- **Tableau de Bord** : Vue d'ensemble des étudiants.
- **Formulaires Dynamiques** : Ajout et édition d'étudiants avec validation en temps réel.
- **Design Responsive** : Interface adaptative pour desktop et mobile.
- **Intégration API** : Communication sécurisée avec le backend via JWT.

---

## 🛠️ Stack Technique

- **Framework** : Angular 19.2.16
- **Langage** : TypeScript
- **Styles** : CSS3, Angular Material (si applicable), Google Fonts (Lato, Merriweather)
- **Tests** : Jest (Unitaires), Cypress/Protractor (E2E)

---

## 📋 Pré-requis

- **Node.js** (Version LTS recommandée, v20+) : [Télécharger](https://nodejs.org/)
- **npm** (Inclus avec Node.js)
- **Angular CLI** : Installé globalement ou utilisé via npx.

---

## ⚡ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Jacknrjkek/ExpertDevOps-P2-Etudiant-Frontend.git
cd etudiant-frontend
```

### 2. Installer les dépendances
```bash
npm install
```

---

## 💻 Développement

Pour lancer le serveur de développement local :

```bash
ng serve
```

Ouvrez votre navigateur sur **http://localhost:4200/**.
L'application se rechargera automatiquement si vous modifiez un fichier source.

> [!NOTE]
> Si le port 4200 est déjà utilisé, Angular CLI vous proposera d'utiliser un autre port (ex: 32783).

---

## 📦 Construction (Build)

Pour générer les fichiers de production dans le dossier `dist/` :

```bash
ng build
```

Les fichiers générés seront optimisés pour la performance (minification, tree-shaking).

---

## 🧪 Tests

### Tests Unitaires
Exécutés via **Jest** pour vérifier la logique des composants et services.

```bash
npm test
# ou directement
npx jest
```

### Tests End-to-End (E2E)
Pour simuler des parcours complets utilisateur.

```bash
ng e2e
```

---

## 📁 Structure du Projet

```
src/
├── app/               # Composants et logique Angular
├── assets/            # Images, polices et fichiers statiques
├── environments/      # Configuration (dev, prod)
├── index.html         # Point d'entrée HTML
├── main.ts            # Point d'entrée scripts
└── styles.css         # Styles globaux
```

---

## 👥 Auteur
Projet réalisé dans le cadre du parcours **Expert DevOps** d'OpenClassrooms.
**Projet 2** : "Testez et améliorez une application existante".
