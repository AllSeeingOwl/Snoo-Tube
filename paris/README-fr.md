# Comment jouer à Paris Pool et utiliser l'application de suivi

## Qu'est-ce que Paris Pool ?
Paris Pool est une variante du billard américain (jeu de la 8), combinant l'adresse à la queue avec la connaissance géographique du réseau métropolitain emblématique de Paris. Les joueurs doivent nommer une station de métro valide qui correspond à la couleur et au type (pleine/rayée) de la bille empochée.

## Comment jouer

### 1. Intégration au jeu de base
* Jouez une partie standard de jeu de la 8. Les billes pleines correspondent aux lignes principales, les billes rayées aux lignes secondaires.
* Après avoir empoché une bille, annoncez une station du métro de Paris correspondant à la couleur de la bille.
* Les stations ne peuvent être utilisées qu'une seule fois par partie (sauf modification par les règles de difficulté ou de joker).
  * Une station valide doit figurer sur le plan officiel du métro de Paris et correspondre aux règles de couleur.
  * Les joueurs ont **10 secondes** pour annoncer une station après avoir empoché une couleur ; en cas d'échec, ils perdent les points de ce coup et leur tour se termine.

### 2. Attribution des couleurs aux lignes
| Couleur de la bille | Lignes pleines | Lignes rayées |
| :--- | :--- | :--- |
| **Jaune** | N, Q | R, W |
| **Bleu** | A | C, E |
| **Rouge** | 1, 2 | 3 |
| **Violet** | 7 | 7 |
| **Orange** | B, D | F, M |
| **Vert** | 4 | 5, 6 |
| **Marron/Bordeaux** | J | Z |
| **Noir (Bille 8)** | L, G | N/A |

* **Correspondances :** Les stations desservant plusieurs lignes peuvent compter pour *n'importe laquelle* de leurs lignes associées, à condition que la ligne corresponde à la couleur empochée.

### 3. Règles d'utilisation des stations
* Une fois qu'une station est annoncée correctement, elle est "verrouillée" et ne peut pas être réutilisée (sauf modification par les règles du joker ou les niveaux de réutilisation des stations).
* **Les stations valides doivent :**
  * Être actuellement actives sur le plan officiel du métro de Paris.
  * Correspondre à la (aux) ligne(s) de couleur associée(s) à la bille empochée (voir Section 2).
* **L'annonce d'une station incorrecte** (ex: mauvaise ligne, déjà utilisée, absente du plan, hors délai) entraîne :
  * Les pénalités standard du billard (ex: bille en main pour l'adversaire).
  * La fin du tour du joueur.

### 4. Options avancées
* **Niveaux de réutilisation des stations :**
  * *Décontracté (Casual) :* Les stations sont réutilisables à l'infini.
  * *Intermédiaire (Intermediate) :* Chaque station peut être utilisée deux fois par partie.
  * *Avancé (Advanced) :* Utilisation stricte, une seule fois par station et par partie.
* **Règle d'épuisement des stations :**
  * Si un joueur pense qu'il ne reste plus aucune station valide et non utilisée pour une ligne requise, il peut :
    * Annoncer une station de correspondance qui dessert la ligne requise (même si elle est principalement connue pour d'autres lignes).
    * En cas de contestation, si le joueur a tort, la pénalité standard s'applique. S'il a raison, le jeu continue.
* **Fonction Joker RER & Tramways (Optionnel) :**
  * Une fois par partie, juste après avoir empoché *n'importe quelle* bille de couleur, un joueur peut choisir d'annoncer une station du **RER** ou de n'importe quelle ligne de **Tramway (T)**.
  * Si l'annonce de la station joker est valide, le joueur **déverrouille une station précédemment utilisée**, la rendant disponible pour être annoncée à nouveau plus tard dans la partie par l'un ou l'autre des joueurs. Le joueur doit déclarer quelle station est déverrouillée.
  * L'annonce de ce joker remplace l'obligation standard de nommer une station correspondant à la couleur empochée pour ce coup.

## Comment utiliser l'application de suivi

Le **Traqueur de Paris Pool** est une application web d'accompagnement conçue pour vous aider à garder une trace des stations pendant que vous jouez.

### Fonctionnalités principales
- **Recherche & Filtrage :** Recherchez instantanément des stations par nom, ligne ou couleur.
- **Niveaux de difficulté :** Basculez facilement entre les règles Avancé (1 utilisation), Intermédiaire (2 utilisations) et Décontracté (utilisations illimitées). L'application verrouillera automatiquement les stations en fonction de votre niveau.
- **Verrouillage des stations :** Lorsqu'une station valide est annoncée, trouvez-la dans la liste et cliquez sur "Enregistrer l'utilisation" (Record Use). Elle sera automatiquement verrouillée et grisée en fonction des règles de niveau.
- **Joker RER & Tramways :** Déverrouillez facilement les stations précédemment utilisées à l'aide du bouton joker intégré.
- **Support hors ligne :** Construit comme une Progressive Web App (PWA). Vous pouvez l'installer sur votre appareil mobile et l'utiliser sans connexion Internet.
- **Persistance des données :** L'état actuel de votre partie est automatiquement enregistré dans le stockage local de votre appareil afin de ne pas perdre votre progression si vous actualisez la page.

## Comment installer l'application

### Exécution en local sur votre ordinateur
Parce que l'application a besoin de charger la base de données du fichier `.csv` et d'enregistrer un Service Worker, vous devez l'exécuter via un serveur web local (vous ne pouvez pas simplement double-cliquer sur le fichier `index.html`).

Si vous avez installé Node.js et `pnpm`, vous pouvez facilement démarrer un serveur :

1. Ouvrez votre terminal/invite de commande.
2. Naviguez vers le dossier racine de ce projet.
3. Installez les dépendances en exécutant :
   ```bash
   pnpm install
   ```
4. Démarrez le serveur en exécutant :
   ```bash
   pnpm start
   ```
   *(Ou `node server.js`).*
5. Ouvrez votre navigateur web et allez à l'adresse `http://localhost:3000/paris/`.

### Installation sur mobile pour une utilisation hors ligne
Vous pouvez ajouter cette application à l'écran d'accueil de votre appareil mobile. Une fois ajoutée, elle se comportera comme une application native et fonctionnera parfaitement même si vous n'avez pas de connexion Internet.

#### Pour iOS (Safari) :
1. Hébergez l'application en ligne (par exemple, en utilisant GitHub Pages, Netlify ou Vercel), ou naviguez vers l'URL hébergée sur votre iPhone/iPad.
2. Appuyez sur le bouton **Partager** (le carré avec une flèche pointant vers le haut) au bas de l'écran.
3. Faites défiler vers le bas les options de partage et appuyez sur **Sur l'écran d'accueil**.
4. Confirmez le nom et appuyez sur **Ajouter**. L'icône de l'application apparaîtra maintenant sur votre écran d'accueil.

#### Pour Android (Chrome) :
1. Hébergez l'application en ligne, ou naviguez vers l'URL hébergée sur votre appareil Android.
2. Vous pouvez voir une invite au bas de l'écran demandant d'"Ajouter Paris Pool à l'écran d'accueil". Si oui, appuyez dessus.
3. Si l'invite n'apparaît pas, appuyez sur l'icône de menu à trois points dans le coin supérieur droit.
4. Appuyez sur **Installer l'application** ou **Ajouter à l'écran d'accueil**.
5. Suivez les instructions à l'écran.