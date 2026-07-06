# Adaptations HTML pour Capacitor

## 1. Remplacer les input[type=file] par le plugin Camera

```html
<!-- AVANT (ton HTML actuel) -->
<input type="file" accept="image/*" capture="camera" id="photos-avant">

<!-- APRES -->
<div id="dropzone-avant" class="dropzone" onclick="prendrePhoto('avant')">
  📸 Photographier AVANT intervention
</div>
```

## 2. Remplacer localStorage par @capacitor/preferences

```javascript
// AVANT
localStorage.setItem('interventions', JSON.stringify(data));

// APRES
import { Preferences } from '@capacitor/preferences';
await Preferences.set({ key: 'interventions', value: JSON.stringify(data) });
```

## 3. Script Capacitor dans le head

```html
<head>
  <script src="capacitor.js"></script>
</head>
```

## 4. Touch targets minimum 44px

```css
button, .dropzone, .btn {
  min-height: 44px;
  min-width: 44px;
}
```
