# V2 Android Capacitor – caméra directe

## Comportement V2
- clic sur ajout photo => ouverture directe de la caméra
- photo enregistrée automatiquement dans la galerie Android
- photo enregistrée aussi dans les données de l'intervention

## Fichiers à copier dans `www/`
- `index.html`
- `capacitor-app.js`

## Après copie
```bash
npx cap sync
npx cap open android
```

## Test conseillé
- lancer l'app
- cliquer sur "Ajouter des photos avant"
- vérifier ouverture directe caméra
- prendre une photo
- vérifier l'aperçu immédiat dans l'app
- enregistrer l'intervention
- vérifier la présence de la photo dans le détail de l'intervention
```
