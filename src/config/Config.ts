//@ts-nocheck
import { Platform } from 'react-native';

import DeviceInfo from 'react-native-device-info';

// export const MINDS_URI = 'https://www.minds.com/';
// export const MINDS_URI = 'http://dev.minds.io/';

// remember to update deeplink uri on AndroidManifest.xml !!!
// export const MINDS_URI = 'http://172.16.2.61:8080/';
export const MINDS_URI = 'https://www.minds.com/';
export const MINDS_API_URI = 'https://www.minds.com/';

export const NETWORK_TIMEOUT = 15000;

export const CONECTIVITY_CHECK_URI = 'https://www.minds.com/';
export const CONECTIVITY_CHECK_INTERVAL = 10000;

export const MINDS_URI_SETTINGS = {
  //basicAuth: 'crypto:ohms',
};

export const MINDS_MAX_VIDEO_LENGTH = 5; // in minutes

export const SOCKET_URI = 'wss://ha-socket-io-us-east-1.minds.com:3030';

export const MINDS_CDN_URI = 'https://cdn.minds.com/';
export const MINDS_ASSETS_CDN_URI = 'https://cdn-assets.minds.com/';
// export const MINDS_CDN_URI = 'http://dev.minds.io/';

export const BLOCKCHAIN_URI = 'https://www.minds.com/api/v2/blockchain/proxy/';
// export const BLOCKCHAIN_URI = 'http://localhost:9545';
export const MINDS_LINK_URI = 'https://www.minds.com/';
export const CODE_PUSH_TOKEN = '';

/**
 * Platform dependant or fixed features
 */
export const MINDS_FEATURES = {
  crypto: true,
  compose: true,
  discovery: true,
  channel: true,
  wallet: true,
};

/**
 * Deeplink to screen/params maping
 */
export const MINDS_DEEPLINK = [
  ['email-confirmation', 'EmailConfirmation'],
  ['groups/profile/:guid/feed', 'GroupView'],
  ['groups/profile/:guid', 'GroupView'],
  ['notifications', 'Notifications'],
  ['groups/:filter', 'GroupsList'],
  ['newsfeed/:guid', 'Activity'],
  ['media/:guid', 'Activity'],
  ['channels/:username', 'Channel'],
  ['blog/:filter', 'BlogList'],
  ['blog/view/:guid', 'BlogView'],
  [':user/blog/:slug', 'BlogView'],
  [':username', 'Channel'],
  ['wallet/tokens/:section', 'Wallet'],
];

export const DISABLE_PASSWORD_INPUTS = false;

// IF TRUE COMMENT THE SMS PERMISSIONS IN ANDROID MANIFEST TOO!!!
export const GOOGLE_PLAY_STORE =
  DeviceInfo.getBuildNumber() < 1050000000 && Platform.OS === 'android';
