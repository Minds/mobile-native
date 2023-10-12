/**
 * Configuration settings for the minds / multi-tenant app, using environment variables.
 *
 * @param {Object} config - The base configuration object, typically from Expo's configuration.
 * @param {string} process.env.APP_NAME - The name of the app (default: 'Minds').
 * @param {string} process.env.APP_SCHEME - The app's scheme, used for deep-links (default: 'mindsapp').
 * @param {string} process.env.APP_VERSION - The app's version (default: '4.42.0').
 * @param {string} process.env.APP_ANDROID_PACKAGE - The Android package name (default: 'com.minds.mobile').
 * @param {string} process.env.APP_IOS_BUNDLE - The iOS bundle identifier (default: 'com.minds.mobile').
 * @param {string} process.env.APP_HOST - The app's host URL, used for deep-links (default: 'www.minds.com').
 * @param {string} process.env.APP_API_URL - The API URL (default: 'https://www.minds.com/').
 * @param {string} process.env.ACCENT_COLOR_LIGHT - Theme accent color (default: '#1B85D6').
 * @param {string} process.env.ACCENT_COLOR_DARK - Theme accent color (default: '#FFD048').
 * @returns {Object} - A configuration object for the Expo app.
 */
export default ({ config }) => ({
  ...config,
  name: process.env.APP_NAME || 'Minds',
  scheme: process.env.APP_SCHEME || 'mindsapp',
  version: process.env.APP_VERSION || '4.42.0',
  plugins: [
    'react-native-iap',
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 33,
          targetSdkVersion: 33,
          buildToolsVersion: '33.0.0',
          kotlinVersion: '1.8.0',
        },
        ios: {
          deploymentTarget: '13.0',
        },
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'This lets you share photos from your library',
        savePhotosPermission: 'This lets you save photos to your camera roll',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: '$(PRODUCT_NAME) needs access to your Camera.',
        enableMicrophonePermission: true,
        microphonePermissionText:
          '$(PRODUCT_NAME) needs access to your Microphone.',
      },
    ],
  ],
  android: {
    package: process.env.APP_ANDROID_PACKAGE || 'com.minds.mobile',
    versionCode: 310178,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: process.env.APP_HOST || 'www.minds.com',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    splash: {
      image: './src/assets/logos/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1C1D1F',
    },
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_MEDIA_LOCATION',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
    ],
  },
  ios: {
    bundleIdentifier: process.env.APP_IOS_BUNDLE || 'com.minds.mobile',
    buildNumber: '1',
    associatedDomains: process.env.APP_HOST
      ? [
          'applinks:' + process.env.APP_HOST,
          'activitycontinuation:' + process.env.APP_HOST,
          'webcredentials:' + process.env.APP_HOST,
        ]
      : [
          'applinks:www.minds.com',
          'activitycontinuation:www.minds.com',
          'webcredentials:www.minds.com',
        ],
    infoPlist: {
      LSApplicationQueriesSchemes: ['mindschat'],
      NSPhotoLibraryUsageDescription:
        'This lets you share photos from your library',
      NSPhotoLibraryAddUsageDescription:
        'This lets you save photos to your camera roll',
      NSCameraUsageDescription: '$(PRODUCT_NAME) needs access to your Camera.',
      NSMicrophoneUsageDescription:
        '$(PRODUCT_NAME) needs access to your Microphone.',
    },
    splash: {
      image: './src/assets/logos/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1C1D1F',
    },
  },
  extra: {
    isTenant: process.env.APP_NAME ? true : false,
    ACCENT_COLOR_LIGHT: process.env.ACCENT_COLOR_LIGHT || '#1B85D6',
    ACCENT_COLOR_DARK: process.env.ACCENT_COLOR_DARK || '#FFD048',
    API_URL: process.env.APP_API_URL || 'https://www.minds.com/',
    eas: {
      projectId: '1bc9a718-f25b-407e-aa16-f18f0ae61b71',
    },
  },
  owner: 'myminds',
});
