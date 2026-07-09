import { Capacitor } from 'https://cdn.jsdelivr.net/npm/@capacitor/core@6.1.2/+esm';
import { Camera, CameraResultType, CameraSource } from 'https://cdn.jsdelivr.net/npm/@capacitor/camera@6.0.2/+esm';
import { Preferences } from 'https://cdn.jsdelivr.net/npm/@capacitor/preferences@6.0.2/+esm';
import { Geolocation } from 'https://cdn.jsdelivr.net/npm/@capacitor/geolocation@6.0.2/+esm';
import { Haptics, ImpactStyle } from 'https://cdn.jsdelivr.net/npm/@capacitor/haptics@6.0.2/+esm';

function slugify(value = '') {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'chantier';
}

function formatDateParts(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return { yyyy, mm, dd, hh, mi, ss, compact: `${yyyy}${mm}${dd}-${hh}${mi}${ss}` };
}

async function safePosition() {
  try {
    const permission = await Geolocation.requestPermissions();
    if (permission.location === 'denied' || permission.coarseLocation === 'denied') return null;
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy || null
    };
  } catch (e) {
    return null;
  }
}

window.CapacitorBridge = {
  isNative: Capacitor.isNativePlatform(),
  async takePhoto(type = 'before', siteName = 'chantier') {
    const capturedAt = new Date();
    const dateParts = formatDateParts(capturedAt);
    const gps = await safePosition();

    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      saveToGallery: true,
      correctOrientation: true
    });

    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    const siteSlug = slugify(siteName);
    const gpsSuffix = gps ? `_${gps.lat.toFixed(5)}_${gps.lng.toFixed(5)}`.replace(/\./g, '-') : '';
    const fileName = `${siteSlug}_${type}_${dateParts.compact}${gpsSuffix}.jpeg`;

    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      fileName,
      data: `data:image/jpeg;base64,${photo.base64String}`,
      path: photo.path || photo.webPath || null,
      createdAt: capturedAt.toISOString(),
      capturedAtLabel: capturedAt.toLocaleString('fr-FR'),
      gps,
      gpsLabel: gps ? `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}` : ''
    };
  },
  async saveInterventions(interventions) {
    await Preferences.set({ key: 'interventions', value: JSON.stringify(interventions || []) });
  },
  async loadInterventions() {
    const { value } = await Preferences.get({ key: 'interventions' });
    return JSON.parse(value || '[]');
  },
  async getCurrentPosition() {
    return await safePosition();
  }
};
