# README — Suivi d'Interventions avec Photos (Android / Capacitor)

## Objectif du projet

Ce projet transforme une interface HTML de suivi d'interventions en application Android via Capacitor, avec un usage pensé pour le terrain : prise de photo avant/après, sauvegarde locale, ouverture directe de la caméra, et préparation à une future mise en ligne sur le Play Store.[cite:62][cite:107]

La version actuellement retenue est la **V3 orientée terrain**, avec ouverture directe de la caméra native, sauvegarde automatique dans la galerie Android, horodatage des photos, récupération GPS si disponible, et nommage propre des fichiers photo.[cite:62][cite:107][cite:119]

## Ce qui a été fait pendant la session

Le projet HTML initial a été adapté pour fonctionner dans Capacitor avec Android Studio, après création d'un dossier `www`, ajout d'un `index.html` compatible, puis synchronisation réussie avec `npx cap sync` afin de copier les assets web dans le projet Android natif.[cite:50]

Le projet Android a ensuite été ouvert dans Android Studio, un émulateur Pixel a été créé et démarré, et l'application a été lancée avec succès depuis le module `app`, ce qui valide la base technique Android/Capacitor.[cite:80][cite:88]

L'évolution fonctionnelle s'est faite en trois étapes :
- V1 : base Capacitor Android avec stockage et affichage.
- V2 : ouverture directe de la caméra au clic sur ajout photo.
- V3 : version terrain avec photo directe, sauvegarde automatique, horodatage, GPS et nommage métier.[cite:62][cite:107]

## Arborescence recommandée

La structure minimale du projet doit ressembler à ceci :

```text
suivi-interventions-capacitor/
├── android/
├── www/
│   ├── index.html
│   └── capacitor-app.js
├── package.json
└── capacitor.config.json
```

Capacitor exige que `www/index.html` existe comme point d'entrée web, sinon la commande `cap sync` ou `cap add android` échoue.[cite:50]

## Prérequis à installer

### Outils nécessaires

- Node.js 18 ou plus.
- npm.
- Android Studio.
- SDK Android installé via Android Studio.
- Émulateur Android ou téléphone Android réel en USB.
- Un compte Google pour tester plus tard sur Play Console.[cite:50][cite:80]

### Vérification rapide

```bash
node --version
npm --version
```

## Dépendances du projet

Les plugins utilisés pour cette version Android sont : caméra, géolocalisation, retour haptique, préférences locales, filesystem, partage, splash screen.[cite:62][cite:107]

### Installation npm

Dans le dossier du projet :

```bash
cd /d F:\GitHub\suivi-interventions-capacitor
npm install
npm install @capacitor/core @capacitor/android @capacitor/camera @capacitor/preferences @capacitor/geolocation @capacitor/haptics @capacitor/filesystem @capacitor/share @capacitor/splash-screen
```

## Configuration Capacitor

### Initialisation du projet

Si le projet devait être recréé depuis zéro :

```bash
mkdir suivi-interventions-capacitor
cd suivi-interventions-capacitor
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init "Suivi Interventions" "fr.rennesdev.suiviinterventions"
```

### Ajout de la plateforme Android

```bash
npx cap add android
```

Cette commande crée le projet Android natif, mais elle nécessite que `www/index.html` soit déjà présent ou que la structure web soit prête pour la copie des assets.[cite:50]

## Commandes à connaître

### 1. Synchroniser le web vers Android

```bash
cd /d F:\GitHub\suivi-interventions-capacitor
npx cap sync
```

Cette commande copie `www/` dans `android/app/src/main/assets/public`, met à jour les plugins Android et régénère la configuration embarquée.[cite:50]

### 2. Ouvrir le projet Android

```bash
npx cap open android
```

Cette commande ouvre le dossier Android natif dans Android Studio, où le build et l'exécution se font ensuite avec le workflow classique Android Studio.[cite:50][cite:88]

### 3. Lancer l'application

Ensuite, dans Android Studio :
- sélectionner l'émulateur ou le téléphone,
- vérifier que `app` est la configuration de lancement,
- cliquer sur le bouton **Run** vert.[cite:80][cite:88]

### 4. Refaire un cycle classique après modification du HTML/JS

À chaque modification de `www/index.html` ou `www/capacitor-app.js` :

```bash
cd /d F:\GitHub\suivi-interventions-capacitor
npx cap sync
```

Puis relancer l'app dans Android Studio.[cite:50]

## Fonctionnement actuel de la V3 terrain

### Photo directe

Le clic sur "Ajouter photo" ouvre directement la caméra native grâce à `Camera.getPhoto()` avec `source: CameraSource.Camera`, ce qui évite le détour par une galerie ou un sélecteur mixte.[cite:62]

### Sauvegarde automatique

Les photos sont enregistrées automatiquement dans la galerie Android avec `saveToGallery: true`, ce qui est pris en charge par le plugin Camera sur Android et iOS.[cite:62][cite:119]

### Géolocalisation

La position GPS est récupérée via `Geolocation.getCurrentPosition()` quand la permission est acceptée, puis associée à l'intervention et à la photo quand elle est disponible.[cite:107][cite:116]

### Métadonnées terrain

Chaque photo peut inclure :
- un horodatage de capture,
- un nom de fichier lisible,
- éventuellement une position GPS,
- un type `before` ou `after` pour distinguer avant/après.[cite:62][cite:107]

## Fichiers importants

### `www/index.html`

Contient l'interface complète de l'application, les formulaires, la liste des interventions, les détails, les aperçus photos et la logique métier côté UI.

### `www/capacitor-app.js`

Contient le pont avec Capacitor :
- ouverture caméra,
- récupération GPS,
- vibration légère,
- sauvegarde locale via Preferences,
- comportement natif Android.

### `capacitor.config.json`

Contient l'identité de l'app et le paramétrage général Capacitor. Le warning `bundledWebRuntime` peut être supprimé car cette option est dépréciée.[cite:50]

## Vérifications Android importantes

### Manifest Android

Dans `android/app/src/main/AndroidManifest.xml`, vérifier la présence des permissions nécessaires :

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

Ces permissions sont nécessaires pour l'accès caméra et géolocalisation dans l'application Android.[cite:62][cite:107]

## Procédure de test recommandée

### Test minimum sur émulateur

1. Lancer l'émulateur dans Android Studio.
2. Lancer l'application.
3. Créer une intervention.
4. Tester les boutons photo.
5. Vérifier la sauvegarde locale et l'affichage.

L'émulateur permet de valider le build et l'interface, mais le test caméra reste plus fiable sur un vrai smartphone Android.[cite:80][cite:103]

### Test réel sur smartphone Android

1. Brancher un téléphone Android en USB.
2. Activer les options développeur et le débogage USB.
3. Autoriser le PC si Android le demande.
4. Sélectionner le téléphone dans Android Studio.
5. Cliquer sur **Run**.

C'est le meilleur test pour valider caméra, permissions, galerie et comportement terrain réel.[cite:80][cite:88]

## Étape suivante pour aller vers la mise en ligne

À ce stade, le code Android est déjà exploitable pour des tests réels. La prochaine phase ne relève plus principalement du développement, mais de la publication Android : génération d'un bundle release `.aab`, création d'une fiche dans Google Play Console, test interne, puis déploiement plus large si les essais sont concluants.[cite:121][cite:132]

### Ce qu'il faudra préparer

- un compte Google Play Console,
- la fiche de l'application,
- l'icône,
- les captures d'écran,
- la description,
- le fichier `.aab` signé.[cite:122][cite:121]

### Coût à prévoir

L'inscription Google Play Console coûte **25 dollars en paiement unique** pour le compte développeur, sans abonnement annuel tant que le compte reste actif.[cite:138][cite:141][cite:148]

### Parcours conseillé

1. Stabiliser cette version V3 sur vrai téléphone.
2. Corriger les derniers points bloquants éventuels.
3. Générer un `.aab` signé.
4. Créer l'application dans Play Console.
5. Commencer par un **test interne** avant publication publique.[cite:121][cite:130][cite:132]

## Commandes essentielles — résumé ultra court

```bash
cd /d F:\GitHub\suivi-interventions-capacitor
npm install
npx cap add android
npx cap sync
npx cap open android
```

Puis dans Android Studio :
- démarrer un émulateur ou brancher un téléphone,
- sélectionner `app`,
- cliquer sur **Run**.[cite:50][cite:80][cite:88]

## Conseils pratiques pour avancer sans te disperser

- Garder cette V3 comme base de travail tant qu'elle remplit bien le besoin terrain.
- Tester d'abord sur un vrai smartphone Android avant d'ajouter d'autres fonctions.
- Ne pas lancer tout de suite de nouvelles améliorations tant que caméra, sauvegarde et enregistrement d'intervention ne sont pas parfaitement stables.
- Préparer la publication Play Store seulement après validation métier sur le terrain.[cite:62][cite:107][cite:121]

## Décision actuelle

La bonne approche, à ce stade, est de conserver cette version comme base sérieuse de démonstration et de test. Elle permet déjà de montrer une vraie application métier Android, avec prise de photo terrain et traçabilité, sans attendre une V4 plus complexe.[cite:62][cite:107]
