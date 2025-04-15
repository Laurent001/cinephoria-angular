import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor(private platform: Platform) {}

  isNativePlatform(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  async requestCameraPermissions(): Promise<boolean> {
    if (!this.isNativePlatform()) {
      return true;
    }

    try {
      await Camera.requestPermissions();
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      return false;
    }
  }
}
