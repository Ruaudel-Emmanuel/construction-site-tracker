# README — Récupération de la clé Android (SHA-256) — version anonymisée

## Contexte

Cette session a servi à récupérer l’empreinte de certificat **SHA-256** nécessaire pour ajouter une clé publique dans la Google Play Console, sur la page **Gérer les clés de package** du package `Construction.Site.Tracker`.[cite:1]

La Play Console demande l’ajout d’une clé publique pour terminer l’enregistrement du nom de package dans le cadre de la validation développeur Android.[cite:1]

## Objectif

L’objectif était de trouver la bonne empreinte **SHA-256** à coller dans la Play Console afin d’associer le package Android à une clé de signature reconnue.[cite:1]

## Étapes réalisées

### 1. Vérification de la méthode

La récupération de l’empreinte a été préparée via Android Studio / Gradle, car les empreintes de certificat de signature sont disponibles via les outils de signature Android et les rapports Gradle associés.[cite:18][cite:17]

### 2. Résolution du blocage Java

L’exécution de `gradlew signingReport` était d’abord bloquée parce que `JAVA_HOME` n’était pas défini, ce qui empêche Gradle de trouver Java et d’exécuter le rapport de signature.[cite:42][cite:43]

La correction recommandée sur Windows consiste à faire pointer `JAVA_HOME` vers le JDK ou le JBR d’Android Studio, puis à ajouter `%JAVA_HOME%\bin` dans le `Path`.[cite:32][cite:42][cite:43]

### 3. Exécution du rapport Gradle

Une fois Java détecté, la commande `gradlew signingReport` a permis d’afficher les empreintes de signature disponibles pour les variantes Android du projet.[cite:18][cite:17]

### 4. Identification de la bonne valeur

Le rapport a affiché une variante `debug` avec une clé détectée dans `C:\Users\[UTILISATEUR]\.android\debug.keystore`, alias `AndroidDebugKey`, ainsi qu’une empreinte **SHA-256** exploitable pour la Play Console.[cite:1]

En revanche, la variante `release` apparaissait avec `Config: null`, `Store: null` et `Alias: null`, ce qui montre qu’aucune signature release n’était encore configurée dans le projet au moment du test.[cite:1]

## Empreinte récupérée

L’empreinte **SHA-256** identifiée pendant la session est la suivante, sous forme anonymisée :

```text
1B:3F:FD:21:9E:F2:7B:9E:AE:1A:5F:3F:AF:EF:43:4B:87:E5:43:B9:AB:7B:FA:9C:XX:XX:XX:XX:XX:XX:XX:XX
```

Cette empreinte correspond à la **debug keystore** du poste local, et non à une clé de production release.[cite:1]

## Où coller cette clé

Dans la Google Play Console, sur la page **Gérer les clés de package**, il faut cliquer sur **Ajouter une clé** puis coller cette empreinte SHA-256 dans le champ demandé pour terminer l’association de la clé avec le package.[cite:1]

## Point d’attention

Cette clé est une clé **debug**. Elle peut permettre d’avancer pour un test ou pour finaliser provisoirement l’enregistrement du package, mais elle n’est pas idéale comme clé finale si l’application doit être publiée avec une vraie signature de production.[cite:1]

Pour une mise en production propre, il faudra configurer une **clé release** dans le projet Android/Capacitor, relancer `gradlew signingReport`, puis récupérer l’empreinte SHA-256 de cette variante release.[cite:18][cite:17]

## Commandes utiles

### Commande pour générer le rapport

```bat
gradlew signingReport
```

Cette commande génère les empreintes de certificat pour les variantes Android configurées dans le projet.[cite:18][cite:17]

### Commandes de vérification Java sous Windows

```bat
echo %JAVA_HOME%
java -version
javac -version
```

Ces commandes permettent de vérifier que Java est bien accessible avant de relancer Gradle.[cite:42][cite:43]

## Résultat de la session

Le blocage Java a été résolu, le rapport de signature a bien été exécuté, et l’empreinte SHA-256 actuellement disponible pour le projet a été récupérée avec succès.[cite:1][cite:42]
EOF && ls -l output/readme-recuperation-cle-android-anonymise.md
