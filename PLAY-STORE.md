# Déploiement Google Play Store — Suivi Interventions

> Ce document décrit la chaîne complète : build → release GitHub → Play Console (tests internes).

## 1. Artefacts

| Fichier | Usage |
|---|---|
| `android/app/build/outputs/bundle/release/app-release.aab` | **fichier à uploader dans la Play Console** (tous les canaux de test et production) |
| `android/app/build/outputs/apk/release/app-release.apk` | APK pour installation directe (test hors Play, « sideload ») |

## 2. Recompiler une nouvelle version

```bash
npm install && npx cap sync android     # synchronise www/ + plugins vers android/
cd android && ./gradlew bundleRelease assembleRelease
```

Prérequis sur la machine de build (installés sur le VPS) :
- JDK 17 (`openjdk-17-jdk-headless`)
- SDK Android : `/opt/android-sdk` (cmdline-tools, platforms;android-34/35, build-tools 34/35)
- `android/local.properties` → `sdk.dir=/opt/android-sdk` (non commité)
- `android/keystore.properties` → chemins + mots de passe signature (non commité)

Augmenter à chaque mise à jour dans `android/app/build.gradle` :
- `versionCode` +1 (entier, jamais de retour arrière)
- `versionName` "x.y.z" (visible par l'utilisateur)

## 3. Signature — TRÈS IMPORTANT

- Keystore : `~/keystores/suivi-interventions-release.keystore` (VPS, inclus dans les
  sauvegardes de /home/ubuntu) — **jamais commité**.
- Credentials : `~/keystores/suivi-interventions-credentials.txt` (chmod 600).
- ⚠️ **Sauvegarde obligatoire hors VPS** (clé USB / gestionnaire de mots de passe) :
  le keystore + son mot de passe sont indispensables pour publier toute mise à jour.
  Sans eux, l'app ne peut plus être mise à jour du tout (nouvelle identité = nouvelle app).
- Validité : 10 000 jours (~27 ans) — conforme aux exigences Play.

## 4. Play Console — publication en tests internes

1. **Créer l'application** : Play Console → Créer une app → nom « Suivi Interventions »,
   type Application, gratuit.
2. **Play App Signing** : lors du 1er upload, laisser l'option par défaut
   « **Google gère la clé de signature de l'app** » (clé d'upload = notre keystore local).
   C'est ce qui permet les mises à jour des utilisateurs vers les app bundles sans
   jamais re-signer soi-même.
3. **Tests internes** : Testing → Internal testing → créer un testeur (email ou liste
   Google Group) → **upload de `app-release.aab`** → notes de version → envoyer en revue.
4. **Requis avant upload** : fiche store (titre, description courte/longue, icône 512×512,
   screenshot), questionnaire contenu, catégorie, déclaration données (l'app utilise
   caméra / stockage / GPS — le déclarer), pays, publicité (non).
5. **Permissions manifest à vérifier** (déjà limitées par les plugins Capacitor) :
   CAMÉRA, GÉOLOCALISATION (access fine/coarse), lecture/écriture média — justifier
   chaque permission dans la déclaration.
6. Lien de test interne : à partager avec les testeurs (ils optent via le lien, installent
   depuis le Play Store).
7. **Mises à jour des testeurs** : uploader la nouvelle version (versionCode+1) dans le
   même canal → les testeurs reçoivent la maj automatiquement (Play télécharge le bundle
   optimisé pour leur appareil). Aucune action de re-signature nécessaire grâce au
   Play App Signing.

## 5. Releases GitHub

Chaque build est publié en release GitHub (tag `vX.Y.Z`) avec l'AAB et l'APK en pièces
jointes — historique des binaires livrés. Tag = versionName.
