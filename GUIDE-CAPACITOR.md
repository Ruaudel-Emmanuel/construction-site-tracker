# Guide Capacitor – Suivi d'Interventions avec Photos
## iOS & Android Store – Emmanuel Ruaudel (rennesdev.fr)

---

## 🎯 Vue d'ensemble

Capacitor (par Ionic) est le pont entre ton fichier HTML et une vraie app native Android/iOS.
Il encapsule ton HTML dans une WebView native et te donne accès aux API du téléphone
(appareil photo, stockage, GPS, notifications) via des plugins JavaScript.

**Avantage clé :** ton HTML existant reste intact à 95%. Tu ajoutes juste
les plugins Capacitor là où le navigateur classique était limité.

---

## 📁 Structure du projet final

```
suivi-interventions/
├── www/                          ← ton HTML va ici
│   └── Suivi-Interventions-Photos.html  (renommé en index.html)
├── android/                      ← généré par Capacitor
├── ios/                          ← généré par Capacitor
├── capacitor.config.json         ← configuration principale
├── package.json
└── GUIDE-CAPACITOR.md
```

---

## 🛠️ Étape 1 – Préparer l'environnement (une seule fois)

### Pré-requis à installer sur ton PC/Mac

| Outil | Pourquoi | Lien |
|-------|----------|------|
| Node.js 18+ | moteur npm | https://nodejs.org |
| Android Studio | compiler l'APK Android | https://developer.android.com/studio |
| Xcode 15+ (Mac uniquement) | compiler pour iOS | Mac App Store |
| Java JDK 17 | requis par Android Studio | inclus dans Android Studio |

### Vérifier que tout est installé
```bash
node --version    # doit afficher v18+
npm --version     # doit afficher 9+
```

---

## 🛠️ Étape 2 – Initialiser le projet Capacitor

```bash
# 1. Créer le dossier projet
mkdir suivi-interventions && cd suivi-interventions

# 2. Initialiser npm
npm init -y

# 3. Installer Capacitor
npm install @capacitor/core @capacitor/cli

# 4. Installer les plugins utiles pour ce projet
npm install @capacitor/camera @capacitor/filesystem @capacitor/geolocation @capacitor/share @capacitor/haptics

# 5. Initialiser Capacitor (réponds aux questions : nom app, bundle ID)
npx cap init "Suivi Interventions" "fr.rennesdev.suiviinterventions"

# 6. Ajouter Android
npx cap add android

# 7. Ajouter iOS (sur Mac uniquement)
npx cap add ios
```

---

## 🛠️ Étape 3 – Préparer le dossier www

```bash
# Créer le dossier web
mkdir www

# Copier ton fichier HTML renommé en index.html
cp /chemin/vers/Suivi-Interventions-Photos.html www/index.html
```

---

## 🛠️ Étape 4 – Synchroniser et ouvrir les projets natifs

```bash
# Synchroniser ton HTML vers les projets natifs
npx cap sync

# Ouvrir Android Studio
npx cap open android

# Ouvrir Xcode (Mac uniquement)
npx cap open ios
```

---

## 📷 Étape 5 – Adapter le HTML pour la caméra native

### Problème actuel
Ton HTML utilise `<input type="file" accept="image/*" capture="camera">`.
Sur mobile, ça marche mais c'est limité : pas de contrôle sur la qualité,
pas d'accès à la galerie proprement, et l'image n'est pas sauvegardée localement.

### Solution Capacitor Camera Plugin

Remplace dans ton index.html le gestionnaire de photos par ce code :

```javascript
// ========================================
// AJOUT EN HAUT DU <script> dans index.html
// ========================================
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Haptics } from '@capacitor/haptics';

// Fonction pour prendre une photo (remplace le click sur l'input file)
async function prendrePhoto(type) {
  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt, // propose Caméra OU Galerie
      saveToGallery: true
    });

    // Retour haptique (vibration légère)
    await Haptics.impact({ style: 'light' });

    // Convertir en data URL pour affichage
    const imageUrl = `data:image/jpeg;base64,${photo.base64String}`;

    // Sauvegarder dans le filesystem local
    const fileName = `intervention_${type}_${Date.now()}.jpeg`;
    await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String,
      directory: Directory.Data
    });

    return { url: imageUrl, fileName: fileName };
  } catch (error) {
    console.error('Erreur photo:', error);
    return null;
  }
}

// ========================================
// MODIFIER les zones de dépôt de photos
// Remplacer les event listeners des dropzones par :
// ========================================
document.getElementById('dropzone-avant').addEventListener('click', async () => {
  const photo = await prendrePhoto('avant');
  if (photo) afficherApercu(photo.url, 'avant');
});

document.getElementById('dropzone-apres').addEventListener('click', async () => {
  const photo = await prendrePhoto('apres');
  if (photo) afficherApercu(photo.url, 'apres');
});
```

---

## 🗺️ Étape 6 – Ajouter la géolocalisation (optionnel mais recommandé)

```javascript
import { Geolocation } from '@capacitor/geolocation';

async function obtenirPosition() {
  try {
    const position = await Geolocation.getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (e) {
    return null;
  }
}

// Ajouter au formulaire pour sauvegarder les coordonnées GPS du chantier
document.getElementById('form-intervention').addEventListener('submit', async (e) => {
  const gps = await obtenirPosition();
  if (gps) {
    // ajouter gps.lat et gps.lng aux données de l'intervention
  }
});
```

---

## 📤 Étape 7 – Partager un rapport PDF

```javascript
import { Share } from '@capacitor/share';

async function partagerRapport(intervention) {
  await Share.share({
    title: `Rapport intervention – ${intervention.chantier}`,
    text: `Intervention du ${intervention.date}\nSite: ${intervention.chantier}\nStatut: ${intervention.statut}\n${intervention.notes}`,
    dialogTitle: 'Partager le rapport'
  });
}
```

---

## ⚙️ Étape 8 – capacitor.config.json (configuration finale)

```json
{
  "appId": "fr.rennesdev.suiviinterventions",
  "appName": "Suivi Interventions",
  "webDir": "www",
  "bundledWebRuntime": false,
  "plugins": {
    "Camera": {
      "permissionType": "prompt"
    },
    "Geolocation": {
      "requestPermissions": true
    },
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#1a1a2e",
      "showSpinner": false
    }
  },
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#1a1a2e"
  },
  "ios": {
    "contentInset": "automatic",
    "backgroundColor": "#1a1a2e"
  }
}
```

---

## 📱 Étape 9 – Permissions Android (AndroidManifest.xml)

Android Studio génère ce fichier. Tu dois y vérifier/ajouter ces lignes
dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />

<!-- Pour la caméra via Capacitor -->
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

---

## 🍎 Étape 10 – Permissions iOS (Info.plist)

Dans `ios/App/App/Info.plist`, ajouter :

```xml
<key>NSCameraUsageDescription</key>
<string>Pour photographier les interventions avant et après travaux</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Pour accéder aux photos de vos interventions</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Pour sauvegarder les photos d'interventions dans votre galerie</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Pour géolocaliser automatiquement le chantier</string>
```

---

## 🏗️ Étape 11 – Générer l'APK Android

### Mode Debug (tests)
```bash
# Dans Android Studio : Build > Build Bundle(s)/APK(s) > Build APK(s)
# Ou en ligne de commande depuis le dossier android/ :
cd android && ./gradlew assembleDebug
# APK généré : android/app/build/outputs/apk/debug/app-debug.apk
```

### Mode Release (Google Play)
```bash
cd android && ./gradlew bundleRelease
# Génère un .aab pour le Google Play Store
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📦 Étape 12 – Publication Google Play Store

### Ce dont tu as besoin
- Un compte Google Play Developer (25$ une seule fois)
- Une clé de signature (.keystore) générée avec Android Studio
- Des captures d'écran (minimum 2, format 16:9)
- Une icône 512x512px PNG
- Une description en français (≤4000 caractères)

### Commande pour générer la keystore
```bash
keytool -genkey -v -keystore suivi-interventions.keystore \
  -alias suivi-interventions \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -dname "CN=Emmanuel Ruaudel, OU=RennesDev, O=RennesDev, L=Rennes, S=Bretagne, C=FR"
```

### build.gradle – configurer la signature
Dans `android/app/build.gradle`, ajouter dans la section `android {}` :

```gradle
signingConfigs {
    release {
        storeFile file('../suivi-interventions.keystore')
        storePassword 'TON_MOT_DE_PASSE'
        keyAlias 'suivi-interventions'
        keyPassword 'TON_MOT_DE_PASSE'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

---

## 🍎 Publication Apple App Store

### Prérequis
- Mac obligatoire avec Xcode 15+
- Compte Apple Developer (99$/an)
- Certificat de distribution + provisioning profile (géré dans Xcode automatiquement avec "Automatically manage signing")

### Commande
```bash
# Depuis le dossier iOS, archiver dans Xcode :
# Product > Archive > Distribute App > App Store Connect
```

---

## 🔄 Workflow quotidien (après le premier setup)

```bash
# 1. Modifier ton HTML (dans www/index.html)
# 2. Synchroniser vers les projets natifs
npx cap sync

# 3. Tester sur émulateur Android
npx cap run android

# 4. Tester sur émulateur iOS (Mac uniquement)
npx cap run ios
```

---

## 💡 Améliorations recommandées pour le Store

| Amélioration | Impact | Difficulté |
|---|---|---|
| Icône app personnalisée (logo RennesDev) | Branding | Faible |
| Splash screen animé | 1ère impression | Faible |
| Mode hors-ligne complet (IndexedDB) | Terrain sans réseau | Moyen |
| Export PDF des rapports | Usage pro | Moyen |
| Synchronisation cloud (Airtable/Supabase) | Multi-utilisateurs | Élevé |
| Notifications push (chantier à planifier) | Engagement | Moyen |

---

## 🐛 Problèmes fréquents & solutions

| Problème | Solution |
|---|---|
| `localStorage` vide au démarrage | Migrer vers `@capacitor/preferences` |
| Photos ne s'affichent pas | Vérifier les permissions `CAMERA` dans le manifest |
| Erreur CORS sur les API | Ajouter domaine dans `capacitor.config.json` → `server.allowNavigation` |
| App crash au lancement | Vérifier les logs Android Studio > Logcat |
| `input type=file` ne marche pas | Remplacer par le plugin Camera (Étape 5) |

---

*Guide rédigé pour le projet Suivi-Interventions-Photos – rennesdev.fr*
*Capacitor v6 – Juin 2026*
