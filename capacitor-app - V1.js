# Android Capacitor – fichiers prêts

## Fichiers à copier dans `www/`
- `index.html`
- `capacitor-app.js`

## Plugins npm à installer
```bash
npm install @capacitor/core @capacitor/android @capacitor/camera @capacitor/preferences @capacitor/geolocation @capacitor/haptics
```

## Commandes Android
```bash
npx cap add android
npx cap sync
npx cap open android
```

## Permissions Android à vérifier
Dans `android/app/src/main/AndroidManifest.xml` :
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```
