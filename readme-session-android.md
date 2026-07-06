# README — Session HTML vers Android

## Objet

Cette session a porté sur la transformation d'applications web existantes en applications Android, avec un focus sur une approche qui évite de réécrire toute la logique métier.

Deux fichiers ont servi d'exemples :

* `atelier-roi-visio-v2-8-fr.html` : application HTML autonome orientée atelier de cadrage, calcul de ROI, synthèse et génération de livrables.\[cite:1]
* `Chat-local-IA-V1-Sans-RespondToChat.json` : workflow n8n orienté traitement de messages, extraction, clarification, génération d'email et journalisation.\[cite:2]

## Ce qui a été établi

L'approche recommandée pour passer une application HTML sous Android sans tout refaire consiste à utiliser un conteneur mobile de type WebView ou, de préférence, Capacitor, afin d'embarquer l'interface web existante dans une application Android native.\[cite:3]\[cite:8]

Le fichier HTML fourni est un bon candidat à cette approche car il contient déjà l'interface, les styles, les scripts, la navigation interne, les calculs métier et la génération de rapports dans une seule page.\[cite:1]

Le fichier JSON n8n ne constitue pas une application Android en lui-même. Il doit rester côté serveur ou être exposé via webhook/API, puis être appelé depuis l'application Android ou l'interface HTML embarquée.\[cite:2]

## Analyse des deux exemples

### 1\. Atelier ROI

Le fichier `atelier-roi-visio-v2-8-fr.html` se comporte déjà comme une mini-application métier. Il inclut des formulaires, une logique d'étapes, des calculs de ROI, une génération de rapport HTML imprimable et des exports de livrables.\[cite:1]

Cette structure favorise un passage vers Android avec peu de changements :

* conservation du HTML/CSS/JS principal ;
* ajout d'un projet Capacitor ou d'une WebView Android ;
* tests ciblés sur le responsive mobile, les téléchargements, l'impression, et le stockage local.\[cite:1]\[cite:3]

Le fichier utilise `localStorage` pour conserver le brouillon, le mode d'affichage et le thème. Ce point doit être testé dans le conteneur Android car le comportement dépend du runtime embarqué et de la configuration du projet.\[cite:1]

### 2\. Chat local IA

Le fichier `Chat-local-IA-V1-Sans-RespondToChat.json` décrit un workflow n8n avec des nœuds comme `chatTrigger`, `postgres`, `emailSend`, `Ollama`, des traitements conditionnels et des écritures en base.\[cite:2]

Cela signifie que ce second exemple relève d'une logique de back-office ou de backend d'automatisation. Pour Android, le bon schéma consiste à garder ce workflow sur un serveur, puis à connecter l'application mobile à ce service plutôt que d'essayer d'exécuter directement le JSON sur le téléphone.\[cite:2]

## Position actuelle du Play Store

Il a été établi que Google Play a renforcé ses politiques d'entrée et de maintien sur le store, notamment via des mises à jour de politiques en 2025 et 2026, des contrôles renforcés sur les comptes développeurs et une exigence accrue sur la protection des données et la transparence vis-à-vis de l'utilisateur.\[cite:20]\[cite:22]\[cite:30]

Les applications basées sur WebView ou hybrides ne sont pas interdites. En revanche, Google cherche à limiter les wrappers pauvres en fonctionnalités et les applications de faible qualité qui se contentent d'afficher un site sans vraie expérience mobile.\[cite:26]\[cite:32]

Les règles récentes mettent aussi l'accent sur la déclaration d'usage des données via la section Data Safety, sur les exigences autour des permissions sensibles, et sur la nécessité d'une politique de confidentialité claire lorsque des données utilisateurs sont collectées ou transmises.\[cite:31]\[cite:34]\[cite:28]

## Impact concret sur les projets

### Pour une application HTML embarquée

L'impact principal ne se situe pas dans la réécriture du produit, mais dans la montée en exigence sur la qualité de finition.

Les points à surveiller sont les suivants :

* expérience mobile réelle, pas une simple page desktop compressée ;
* stabilité de l'application ;
* clarté de l'usage métier ;
* transparence sur les données manipulées ;
* présence d'une politique de confidentialité si des données clients sont saisies ou envoyées.\[cite:26]\[cite:31]\[cite:34]

Pour l'atelier ROI, cela reste favorable : l'application apporte une vraie valeur métier, possède des interactions riches et ne ressemble pas à un simple site vitrine emballé dans une coquille Android.\[cite:1]\[cite:26]

### Pour une application connectée à n8n

Dès qu'une application mobile envoie des informations vers un workflow n8n, une base Postgres, un serveur d'email ou un service d'IA, il faut documenter le traitement des données et sécuriser les échanges via HTTPS et une architecture claire côté backend.\[cite:2]\[cite:25]\[cite:34]

Dans ce cadre, le risque principal n'est pas tant le refus lié à la technologie qu'un rejet pour manque de clarté sur l'usage des données, qualité jugée trop faible, ou expérience mobile insuffisante.\[cite:24]\[cite:26]\[cite:30]

## Recommandation de mise en œuvre

La trajectoire la plus pragmatique issue de cette session est la suivante :

1. Transformer l'application HTML en version mobile-friendly.
2. L'embarquer dans Capacitor pour Android.
3. Garder n8n côté serveur.
4. Connecter l'app Android au workflow via API/webhook.
5. Préparer les éléments de conformité Play Store avant publication : politique de confidentialité, fiche Data Safety, tests UX mobile, vérification des permissions, et contrôle qualité complet.\[cite:3]\[cite:20]\[cite:22]\[cite:31]\[cite:34]

## Lecture business

Pour des projets freelance orientés PME, BTP, automatisation et IA, cette approche permet de vendre non seulement une application mobile, mais aussi une réduction du risque projet : moins de réécriture, délai plus court, budget plus maîtrisé, et chemin plus réaliste vers une publication conforme sur Android.\[cite:24]\[cite:26]

Le positionnement pertinent n'est donc pas “faire une app Android native from scratch”, mais “transformer un service web métier en application Android exploitable sur le terrain, avec une couche de conformité Play Store et de protection des données”.\[cite:22]\[cite:26]\[cite:34]

