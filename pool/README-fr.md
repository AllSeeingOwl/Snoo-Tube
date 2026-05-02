# Comment jouer à Pool Subway & Utiliser l'application Tracker

## Qu'est-ce que Pool Subway ?
Pool Subway est une variante du billar (jeu de la 8) traditionnel, qui combine l'habileté au tir avec la connaissance géographique du réseau de métro emblématique de New York. Les joueurs doivent annoncer une station valide du métro de New York qui correspond à la couleur et au type (pleine/rayée) de la bille empochée.

## Comment jouer

### 1. Intégration de base au gameplay
* Jouez au billard standard (jeu de la 8). Les billes pleines correspondent aux lignes principales, les rayées aux lignes secondaires.
* Après avoir empoché une bille, annoncez une station de NY correspondant à la couleur de la bille.
* Les stations ne peuvent être utilisées qu'une seule fois par partie (sauf modification par les règles).
  * Une station valide doit figurer sur le plan officiel du métro de NY.
  * Les joueurs ont **10 secondes** pour annoncer une station après avoir empoché une bille.

### 2. Correspondance Couleurs - Lignes
| Couleur de la Bille | Lignes (Pleines) | Lignes (Rayées) |
| :--- | :--- | :--- |
| **Jaune** | N, Q | R, W |
| **Bleue** | A | C, E |
| **Rouge** | 1, 2 | 3 |
| **Violette** | 7 | 7 |
| **Orange** | B, D | F, M |
| **Verte** | 4 | 5, 6 |
| **Marron/Bordeaux** | J | Z |
| **Noire (8)** | L, G | N/A |

* **Correspondances :** Les stations desservant plusieurs lignes peuvent compter pour *n'importe laquelle* de leurs lignes associées.

### 3. Règles d'utilisation des stations
* Une fois annoncée correctement, une station est "verrouillée" et ne peut plus être réutilisée.
* **Une station invalide** (ex: mauvaise ligne, déjà utilisée) entraîne une faute standard de billard (ex: bille en main).

### 4. Options Avancées
* **Niveaux de réutilisation :**
  * *Casual:* Stations réutilisables.
  * *Intermédiaire:* 2 utilisations max.
  * *Avancé:* 1 seule utilisation.
* **Joker Staten Island & Shuttles :**
  * Une fois par partie, un joueur peut annoncer une station du **Staten Island Railway** ou d'une ligne **Shuttle (S)** pour **débloquer une station déjà utilisée**.

## Comment utiliser l'application Tracker
Application web pour suivre les stations utilisées. Identique à l'application standard. Fonctionne hors-ligne (PWA).

## Installation
Exécutez `pnpm start` à la racine et allez sur `http://localhost:3000/pool/`.
Pour le mobile, ajoutez la page à votre écran d'accueil.
