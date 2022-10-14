//@ts-nocheck
import { storages } from '~/common/services/storage/storages.service';
import { Platform, PlatformIOSStatic } from 'react-native';
import RNConfig from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { DevMode } from './DevMode';

export const IS_IOS = Platform.OS === 'ios';
export const IS_IPAD = (Platform as PlatformIOSStatic).isPad;
export const ONCHAIN_ENABLED = false;
export const PRO_PLUS_SUBSCRIPTION_ENABLED = !IS_IOS;

// we should check how to use v2 before enable it again
export const LIQUIDITY_ENABLED = false;

export const STAGING_KEY = 'staging';
export const CANARY_KEY = 'canary';

export const ENV =
  typeof RNConfig === 'undefined' ? 'test' : RNConfig.ENV ?? 'production';

// Override the production if there is a value defined for the environment
export const CODE_PUSH_KEY = IS_IOS
  ? RNConfig.CODEPUSH_KEY_IOS
  : RNConfig.CODEPUSH_KEY_ANDROID;

export const IS_PRODUCTION = ENV === 'production';
export const IS_REVIEW = ENV === 'review';

// developer mode controller
export const DEV_MODE = new DevMode(IS_REVIEW);

export const CUSTOM_API_URL = DEV_MODE.getApiURL();

/**
 * We get the values only for review apps in order to avoid issues
 * by setting them to true in a review app and after updating the app
 * with a production version having that option turned on
 */
export const MINDS_STAGING = DEV_MODE.isActive
  ? storages.app.getBool(STAGING_KEY) || false
  : false;
export const MINDS_CANARY = DEV_MODE.isActive
  ? storages.app.getBool(CANARY_KEY) || false
  : false;

// network timeout time
export const NETWORK_TIMEOUT = 15000;

// comments char limit
export const CHAR_LIMIT = 1500;

export const DATA_SAVER_THUMB_RES = 96;

// the maximum length of the image (width or height).
// we limit all image sizes to this number to reduce image size
export const IMAGE_MAX_SIZE = 2048;

export const ANDROID_CHAT_APP = 'com.minds.chat';

export const MINDS_URI = 'https://www.minds.com/';
export const MINDS_API_URI =
  DEV_MODE.isActive && CUSTOM_API_URL
    ? CUSTOM_API_URL
    : 'https://www.minds.com/';

export const CONECTIVITY_CHECK_URI = 'https://www.minds.com/';
export const CONECTIVITY_CHECK_INTERVAL = 10000;
export const MINDS_GUID = '100000000000000519';

export const MINDS_URI_SETTINGS = {
  //basicAuth: 'crypto:ohms',
};

export const MINDS_MAX_VIDEO_LENGTH = 5; // in minutes

export const SOCKET_URI = 'wss://ha-socket-alb-io-us-east-1.minds.com';

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
  ['email-confirmation', 'EmailConfirmation'],
  ['groups/profile/:guid/feed', 'GroupView'],
  ['groups/profile/:guid', 'GroupView'],
  ['notifications', 'Notifications', 'navigate'],
  ['notifications/:version', 'Notifications', 'navigate'],
  ['groups/:filter', 'More/GroupsList'],
  ['newsfeed/:guid', 'Activity'],
  ['media/:guid', 'Activity'],
  ['channels/:username', 'Channel'],
  ['blog/:filter', 'BlogList'],
  ['blog/view/:guid', 'BlogView'],
  [':user/blog/:slug', 'BlogView'],
  [':username', 'Channel'],
  ['wallet/:currency/:section', 'More/Wallet', 'navigate'],
  ['analytics/dashboard/:type/:subtype', 'More/Analytics', 'navigate'],
  ['analytics/dashboard/:type', 'More/Analytics', 'navigate'],
  ['discovery/search', 'DiscoverySearch'],
  ['discovery/plus/:tab', 'More/PlusDiscoveryScreen', 'navigate'], // screen name has slashes to indicate nested screens
  ['discovery/:tab', 'Discovery', 'navigate'],
  [
    'supermind/inbox',
    'More/SupermindConsole',
    'navigate',
    {
      tab: 'inbound',
    },
  ],
  [
    'supermind/outbox',
    'More/SupermindConsole',
    'navigate',
    {
      tab: 'outbound',
    },
  ],
  ['supermind/:guid', 'Supermind', 'navigate'],
];

// IF TRUE COMMENT THE SMS PERMISSIONS IN ANDROID MANIFEST TOO!!!
export const GOOGLE_PLAY_STORE =
  DeviceInfo.getBuildNumber() < 1050000000 && Platform.OS === 'android';

export const IS_FROM_STORE = GOOGLE_PLAY_STORE || Platform.OS === 'ios';

// in ms
export const NEWSFEED_NEW_POST_POLL_INTERVAL = 30000;

export const CAPTCHA_ENABLED_ENDPOINTS = [
  {
    url: /api\/v1\/votes\/.*\/up/,
    method: 'put',
    origin: 'vote_up',
  },
];
