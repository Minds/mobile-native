import { Platform, PlatformIOSStatic } from 'react-native';
import RNConfig from 'react-native-config';
import tinycolor from 'tinycolor2';

import Tenant from '../../tenant.json';
import { Version } from './Version';

export const IS_IOS = Platform.OS === 'ios';
export const IS_IPAD = (Platform as PlatformIOSStatic).isPad;

export const ONCHAIN_ENABLED = false;

// we should check how to use v2 before enable it again
export const LIQUIDITY_ENABLED = false;

export const STAGING_KEY = 'staging';
export const CANARY_KEY = 'canary';

export const ENV =
  typeof RNConfig === 'undefined' ? 'test' : RNConfig.ENV ?? 'production';

export const IS_PRODUCTION = ENV === 'production';
export const IS_REVIEW = ENV === 'review';
// developer mode controller
// Enabled Features for the app
export const IS_TENANT = Tenant.APP_NAME !== 'Minds';
/**
 * Is a tenant preview app (packaged to be used with the mobile preview app)
 */
export const IS_TENANT_PREVIEW = Tenant.IS_PREVIEW && IS_TENANT;
export const SUPERMIND_ENABLED = !IS_TENANT;
export const BOOST_POST_ENABLED = !IS_TENANT;
export const WALLET_ENABLED = !IS_TENANT;
export const AFFILIATES_ENABLED = !IS_TENANT;
export const MEMBERSHIP_TIERS_ENABLED = !IS_TENANT;
export const NEWSFEED_FORYOU_ENABLED = !IS_TENANT;
export const WIRE_ENABLED = !IS_TENANT && !IS_IOS;
export const PRO_PLUS_SUBSCRIPTION_ENABLED = !IS_IOS && !IS_TENANT;
export const BOOSTS_ENABLED = !IS_TENANT;
export const CHAT_ENABLED = !IS_TENANT;

// Theme
export const TENANT_THEME = Tenant.THEME === 'light' ? 0 : 1;

// Configurable light colors
export const ACCENT_COLOR_LIGHT = Tenant.ACCENT_COLOR_LIGHT;
export const BACKGROUND_PRIMARY_COLOR_LIGHT =
  Tenant.BACKGROUND_COLOR_LIGHT || '#FFFFFF';
export const BACKGROUND_PRIMARY_HIGHLIGHT_COLOR_LIGHT = tinycolor(
  BACKGROUND_PRIMARY_COLOR_LIGHT,
)
  .darken(1.8)
  .toHex8String();

export const BACKGROUND_SECONDARY_COLOR_LIGHT = tinycolor(
  Tenant.BACKGROUND_COLOR_LIGHT,
)
  .darken(3)
  .toHex8String();

export const BACKGROUND_TERTIARY_COLOR_LIGHT = tinycolor(
  Tenant.BACKGROUND_COLOR_LIGHT,
)
  .darken(10)
  .toHex8String();

// Configurable dark colors
export const ACCENT_COLOR_DARK = Tenant.ACCENT_COLOR_DARK;

export const BACKGROUND_PRIMARY_COLOR_DARK =
  Tenant.BACKGROUND_COLOR_DARK || '#010100';
export const BACKGROUND_PRIMARY_HIGHLIGHT_COLOR_DARK = tinycolor(
  BACKGROUND_PRIMARY_COLOR_DARK,
)
  .lighten(2.8)
  .toHex8String();

export const BACKGROUND_SECONDARY_COLOR_DARK = tinycolor(
  BACKGROUND_PRIMARY_COLOR_DARK,
)
  .lighten(11.4)
  .toHex8String();

export const BACKGROUND_TERTIARY_COLOR_DARK = tinycolor(
  Tenant.BACKGROUND_COLOR_DARK,
)
  .lighten(15)
  .toHex8String();

export const TENANT = Tenant.APP_NAME;
export const TENANT_ID = Tenant.TENANT_ID;

export const WELCOME_LOGO = Tenant.WELCOME_LOGO;

// network timeout time
export const NETWORK_TIMEOUT = 15000;

// comments char limit
export const CHAR_LIMIT = 1500;

export const DATA_SAVER_THUMB_RES = 96;

// the maximum length of the image (width or height).
// we limit all image sizes to this number to reduce image size
export const IMAGE_MAX_SIZE = 2048;

export const ANDROID_CHAT_APP = 'com.minds.chat';

export const STRAPI_URI = 'https://cms.minds.com';

export const APP_SCHEME_URI = `${Tenant.APP_SCHEME}://`;
export const APP_HOST = Tenant.APP_HOST;
export const APP_URI = Tenant.API_URL;
export const APP_API_URI = Tenant.API_URL;

const STRAPI_PROD = true;
export const STRAPI_API_URI = STRAPI_PROD
  ? `${STRAPI_URI}/graphql`
  : 'https://cms.oke.minds.io/graphql';

export const CONECTIVITY_CHECK_URI = 'https://www.minds.com/';
export const CONECTIVITY_CHECK_INTERVAL = 10000;
export const MINDS_GUID = '100000000000000519';

export const APP_URI_SETTINGS = {
  //basicAuth: 'crypto:ohms',
};

export const MINDS_MAX_VIDEO_LENGTH = 5; // in minutes

export const MINDS_CDN_URI = IS_TENANT
  ? Tenant.API_URL
  : 'https://cdn.minds.com/';
export const MINDS_ASSETS_CDN_URI = 'https://cdn-assets.minds.com/';

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
  'memberships',
  'youtube-migration',
  'branding',
  'localization',
].map(p => [p, 'Redirect']);

/**
 * Deeplink to screen/params mapping
 */
export const MINDS_DEEPLINK = [
  ...redirectPages,
  ['chat/rooms', 'ChatListStack/ChatsList', 'navigate'],
  ['chat/rooms/:roomGuid', 'App/ChatStack/Chat', 'navigate'],
  ['forgot-password;:username;:code', 'ResetPassword'],
  ['groups/memberships', 'Groups/GroupsList'],
  ['groups/profile/:guid/feed', 'GroupView'],
  ['groups/profile/:guid', 'GroupView'],
  ['group/:guid/latest', 'GroupView'],
  ['group/:guid/top', 'GroupView'],
  ['group/:guid/member', 'GroupView'],
  ['notifications', 'Notifications', 'navigate'],
  ['notifications/:version', 'Notifications', 'navigate'],
  ['groups/:filter', 'Groups/GroupsList'],
  ['newsfeed/:guid', 'App/Activity'],
  ['media/:guid', 'Activity'],
  ['channels/:username', 'Channel'],
  ['blog/:filter', 'BlogList'],
  ['blog/view/:guid', 'BlogView'],
  ['composer', 'Compose', 'navigate'],
  [':user/blog/:slug', 'BlogView'],
  [':username', 'Channel'],
  ['wallet/:currency/:section', 'More/Wallet', 'navigate'],
  ['analytics/dashboard/:type/:subtype', 'More/Analytics', 'navigate'],
  ['analytics/dashboard/:type', 'More/Analytics', 'navigate'],
  ['discovery/search', 'DiscoverySearch'],
  ['discovery/plus/:tab', 'More/PlusDiscoveryScreen', 'navigate'], // screen name has slashes to indicate nested screens
  ['discovery/:tab', 'Discovery/Discovery', 'navigate'],
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
  ['boost/boost-console', 'BoostConsole', 'navigate'],
  ['boost/console/newsfeed/history', 'BoostConsole', 'navigate'],
];

const buildNumber = parseInt(`${Version.BUILD}`, 10);

export const GOOGLE_PLAY_STORE =
  buildNumber < 1050000000 && Platform.OS === 'android';

export const IS_ANDROID_OSS =
  buildNumber >= 1050000000 && Platform.OS === 'android';

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

/**
 * used to measure the user's interaction with the app
 */
export const USAGE_SCORES = {
  viewPost: 0.1,
  appSession: 1,
  upvote: 2,
  downvote: -1,
  remind: 3,
  createPost: 5,
  comment: 5,
};

/**
 * if user's usage score increased beyond this threshold, they will
 * get prompted to rate the app
 */
export const RATING_APP_SCORE_THRESHOLD = 20;

const APP_STORE_REVIEW_LINK =
  'itms-apps://apps.apple.com/app/id961771928?action=write-review';
const APP_STORE_LINK = 'itms-apps://apps.apple.com/app/id961771928';
const PLAY_STORE_LINK = 'market://details?id=com.minds.mobile';

export const STORE_REVIEW_LINK = Platform.select({
  ios: APP_STORE_REVIEW_LINK,
  android: PLAY_STORE_LINK,
}) as string;

export const STORE_LINK = Platform.select({
  ios: APP_STORE_LINK,
  android: PLAY_STORE_LINK,
}) as string;

export const BOOSTS_DELAY = 604800;

/**
 * PostHog setup
 */
export const POSTHOG_API_KEY = Tenant.POSTHOG_API_KEY;
export const POSTHOG_HOST = 'https://p.minds.com';
