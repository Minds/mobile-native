//@ts-nocheck
import { Platform } from 'react-native';

import DeviceInfo from 'react-native-device-info';

// Send staging cookie to api
export const MINDS_STAGING = false;
export const MINDS_CANARY = false;

// network timeout time
export const NETWORK_TIMEOUT = 15000;

// comments char limit
export const CHAR_LIMIT = 1500;

export const DATA_SAVER_THUMB_RES = 96;

export const ANDROID_CHAT_APP = 'com.minds.chat';

export const MINDS_URI = 'https://www.minds.com/';
export const MINDS_API_URI = 'https://www.minds.com/';

export const CONECTIVITY_CHECK_URI = 'https://www.minds.com/';
export const CONECTIVITY_CHECK_INTERVAL = 10000;
export const MINDS_GUID = '100000000000000519';

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

export const MINDS_PRO = 'https://www.minds.com/pro';

/**
 * Platform dependant or fixed features
 */
export const MINDS_FEATURES = {
  crypto: true,
  compose: true,
  discovery: true,
  channel: true,
  wallet: true,
  'mindsVideo-2020': true,
  'onboarding-october-2020': true,
};

const redirectPages = [
  'plus',
  'token',
  'help',
  'canary',
  'mobile',
  'content-policy',
  'jobs',
  'upgrades',
  'pro',
  'pay',
  'nodes',
  'login',
  'boost',
  'rewards',
  'youtube-migration',
  'branding',
  'localization',
].map(p => [p, 'Redirect']);

/**
 * Deeplink to screen/params mapping
 */
export const MINDS_DEEPLINK = [
  ...redirectPages,
  ['forgot-password;:username;:code', 'ResetPassword'],
  ['settings/other/referrals', 'Referrals'],
  ['groups/profile/:guid/feed', 'GroupView'],
  ['groups/profile/:guid', 'GroupView'],
  ['notifications', 'Notifications', 'navigate'],
  ['groups/:filter', 'GroupsList'],
  ['newsfeed/:guid', 'Activity'],
  ['media/:guid', 'Activity'],
  ['channels/:username', 'Channel'],
  ['blog/:filter', 'BlogList'],
  ['blog/view/:guid', 'BlogView'],
  [':user/blog/:slug', 'BlogView'],
  [':username', 'Channel'],
  ['wallet/:currency/:section', 'Tabs/CaptureTab/Wallet', 'navigate'],
  [
    'analytics/dashboard/:type/:subtype',
    'Tabs/CaptureTab/Analytics',
    'navigate',
  ],
  ['analytics/dashboard/:type', 'Tabs/CaptureTab/Analytics', 'navigate'],
  ['discovery/search', 'DiscoverySearch'],
  ['discovery/plus/:tab', 'Tabs/CaptureTab/PlusDiscoveryScreen', 'navigate'], // screen name has slashes to indicate nested screens
  ['discovery/:tab', 'Discovery', 'navigate'],
];

// IF TRUE COMMENT THE SMS PERMISSIONS IN ANDROID MANIFEST TOO!!!
export const GOOGLE_PLAY_STORE =
  DeviceInfo.getBuildNumber() < 1050000000 && Platform.OS === 'android';

export const IS_FROM_STORE = GOOGLE_PLAY_STORE || Platform.OS === 'ios';
