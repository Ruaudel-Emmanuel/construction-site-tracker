# V3 Terrain – Android Capacitor

## Ce que fait la V3
- ouverture directe de la caméra au clic
- sauvegarde automatique en galerie Android
- aperçu immédiat dans l'app
- horodatage automatique par photo
- GPS automatique si disponible
- nom de fichier propre : `chantier_type_YYYYMMDD-HHMMSS_lat_lng.jpeg`

## Fichiers à copier dans `www/`
- `index.html`
- `capacitor-app.js`

## Commandes
```bash
npx cap sync
npx cap open android
```

## Test terrain recommandé
1. Saisir le nom du chantier
2. Cliquer sur photo AVANT
3. Autoriser GPS/caméra si demandé
4. Prendre la photo
5. Vérifier l'aperçu et l'horodatage
6. Faire la photo APRÈS
7. Enregistrer l'intervention
8. Vérifier le détail avec GPS + noms de fichiers
```
