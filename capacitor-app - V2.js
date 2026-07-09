import { Capacitor } from 'https://cdn.jsdelivr.net/npm/@capacitor/core@6.1.2/+esm';
import { Camera, CameraResultType, CameraSource } from 'https://cdn.jsdelivr.net/npm/@capacitor/camera@6.0.2/+esm';
import { Preferences } from 'https://cdn.jsdelivr.net/npm/@capacitor/preferences@6.0.2/+esm';
import { Geolocation } from 'https://cdn.jsdelivr.net/npm/@capacitor/geolocation@6.0.2/+esm';
import { Haptics, ImpactStyle } from 'https://cdn.jsdelivr.net/npm/@capacitor/haptics@6.0.2/+esm';

window.CapacitorBridge = {
  isNative: Capacitor.isNativePlatform(),
  async takePhoto(type = 'before') {
    // V2: direct opening of native camera + auto-save in gallery
    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      saveToGallery: true
    });

    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      data: `data:image/jpeg;base64,${photo.base64String}`,
      path: photo.path || photo.webPath || null,
      createdAt: new Date().toISOString()
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
};
