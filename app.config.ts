import { ExpoConfig, ConfigContext } from 'expo/config';
import Tenant from './tenant.json';
import { APP_VERSION } from './app.constants';

// We only use a custom build number for Android OSS builds (The rest use auto-incremented build numbers)
const appBuildNumber = process.env.MINDS_APP_BUILD
  ? { versionCode: parseInt(process.env.MINDS_APP_BUILD, 10) }
  : {};

const IS_OSS = (appBuildNumber.versionCode || 0) > 1050000001;

type ResizeType = 'cover' | 'contain';

/**
 * Configuration settings for the minds / multi-tenant app, using environment variables.
 */

const name = Tenant.APP_NAME;
const theme = Tenant.THEME;
const is_dark = theme === 'dark';
const is_previewer_app = Tenant.APP_SLUG === 'mindspreview';

/**
 * The camera and microphone permissions messages are different for the previewer app.
 */
const cameraMessage = is_previewer_app
  ? 'Camera access lets you scan QR codes to preview your mobile app, and to create posts with photos and videos.'
  : 'Camera access lets you create posts with photos and videos.';
const micMessage = 'Microphone access lets you create new posts with videos.';

const extraUpdate: any = is_previewer_app
  ? {
      checkAutomatically: 'NEVER',
      fallbackToCacheTimeout: 0,
    }
  : {};

const permissions = [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.ACCESS_MEDIA_LOCATION',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.POST_NOTIFICATIONS',
];

if (IS_OSS) {
  permissions.push('android.permission.REQUEST_INSTALL_PACKAGES');
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name,
  scheme: Tenant.APP_SCHEME,
  slug: Tenant.APP_SLUG || 'minds',
  version: APP_VERSION,
  icon: './assets/images/icon.png',
  orientation: 'portrait',
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: [
    'react-native-iap',
    'expo-updates',
    'expo-localization',
    './node_modules/react-native-notifications/app.plugin.js',
    [
      '@sentry/react-native/expo',
      {
        organization: 'minds-inc',
        project: 'mobile',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
          kotlinVersion: '1.8.0',
        },
        ios: {
          deploymentTarget: '13.4',
          flipper: false,
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
        cameraPermissionText: cameraMessage,
        enableMicrophonePermission: true,
        microphonePermissionText: micMessage,
      },
    ],
    './plugins/withAndroidMainApplicationAttributes.js',
  ],
  android: {
    package: Tenant.APP_ANDROID_PACKAGE,
    adaptiveIcon: Tenant.ADAPTIVE_ICON
      ? {
          foregroundImage: Tenant.ADAPTIVE_ICON,
          backgroundColor: Tenant.ADAPTIVE_COLOR,
        }
      : undefined,
    ...appBuildNumber,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: Tenant.APP_HOST || 'www.minds.com',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    splash: {
      image: './assets/images/splash.png',
      resizeMode: Tenant.APP_SPLASH_RESIZE as ResizeType,
      backgroundColor: is_dark
        ? Tenant.BACKGROUND_COLOR_DARK
        : Tenant.BACKGROUND_COLOR_LIGHT,
    },
    permissions,
    googleServicesFile: './google-services.json',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: Tenant.APP_IOS_BUNDLE,
    associatedDomains: Tenant.APP_HOST
      ? [
          'applinks:' + Tenant.APP_HOST,
          'activitycontinuation:' + Tenant.APP_HOST,
          'webcredentials:' + Tenant.APP_HOST,
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
      NSCameraUsageDescription: cameraMessage,
      NSMicrophoneUsageDescription: micMessage,
    },
    splash: {
      image: './assets/images/splash.png',
      resizeMode: Tenant.APP_SPLASH_RESIZE as ResizeType,
      backgroundColor: is_dark
        ? Tenant.BACKGROUND_COLOR_DARK
        : Tenant.BACKGROUND_COLOR_LIGHT,
    },
  },
  notification: {
    icon: './assets/images/icon_mono.png',
    color: Tenant.ACCENT_COLOR_LIGHT,
    iosDisplayInForeground: true,
  },
  extra: {
    eas: {
      projectId:
        Tenant.EAS_PROJECT_ID || '7a92bc49-6d7e-468f-af13-0a9aff39fc0e',
    },
  },
  updates: {
    ...extraUpdate,
    url: `https://u.expo.dev/${
      Tenant.EAS_PROJECT_ID || '7a92bc49-6d7e-468f-af13-0a9aff39fc0e'
    }`,
  },
  owner: 'minds-inc',
});
