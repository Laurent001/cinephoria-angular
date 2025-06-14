import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.laurent.cinephoria',
  appName: 'cinephoria',
  webDir: 'dist/browser',
  plugins: {
    Camera: {
      promptBeforeEnable: true,
      defaultMode: 'rear',
    },
    Permissions: {
      permissions: ['camera'],
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
