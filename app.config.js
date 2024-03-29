export default {
  expo: {
    name: 'Zen Alarm',
    slug: 'alarm-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.sleep.zenalarm',
      buildNumber: '3',
      infoPlist: {
        UIBackgroundModes: ['audio', 'processing', 'fetch', 'remote-notification'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.sleep.zenalarm',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-notifications',
        {
          sounds: ['./assets/sounds/birds2.wav'],
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '7fdd7fce-2c19-466e-9e70-00ba83db1d73',
      },
    },
  },
};
