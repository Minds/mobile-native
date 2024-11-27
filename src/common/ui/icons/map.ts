export type IconMapNameType = keyof typeof ICON_MAP;
type Icon = {
  font: string;
  name: string;
  ratio?: number;
  top?: number;
  transform?: any;
};

const ICON_MAP = {
  dev: {
    font: 'MaterialCommunityIcons',
    name: 'dev-to',
  },
  creator: {
    font: 'IonIcon',
    name: 'color-palette',
  },
  pro: {
    font: 'MaterialCommunityIcons',
    name: 'professional-hexagon',
  },
  info: {
    font: 'MaterialCommunityIcons',
    name: 'information-variant',
  },
  'info-circle': {
    font: 'MaterialIcons',
    name: 'info',
  },
  'info-outline': {
    font: 'MaterialIcons',
    name: 'info-outline',
  },
  binoculars: {
    font: 'MaterialCommunityIcons',
    name: 'binoculars',
  },
  supermind: {
    font: 'MaterialCommunityIcons',
    name: 'lightbulb',
  },
  explore: {
    font: 'MaterialCommunityIcons',
    name: 'compass',
  },
  warning: {
    font: 'MaterialIcons',
    name: 'warning',
  },
  filter: {
    font: 'MaterialCommunityIcons',
    name: 'filter',
  },
  refresh: {
    font: 'MaterialCommunityIcons',
    name: 'refresh',
  },
  calendar: {
    font: 'MaterialCommunityIcons',
    name: 'calendar',
  },
  send: {
    font: 'IonIcon',
    name: 'send',
  },
  cog: {
    font: 'MaterialCommunityIcons',
    name: 'cog',
  },
  camera: {
    font: 'IonIcon',
    name: 'camera-sharp',
  },
  image: {
    font: 'Feather',
    name: 'image',
  },
  subscriptions: {
    font: 'FontAwesome',
    name: 'group',
    ratio: 0.8,
  },
  list: {
    font: 'MaterialIcons',
    name: 'format-list-bulleted',
  },
  more: {
    font: 'MaterialIcons',
    name: 'more-vert',
    ratio: 0.92,
  },
  'more-horiz': {
    font: 'MaterialIcons',
    name: 'more-horiz',
    ratio: 0.92,
  },
  tags: {
    font: 'MaterialIcons',
    name: 'local-offer',
    ratio: 0.92,
  },
  close: {
    font: 'MaterialIcons',
    name: 'close',
    ratio: 0.92,
  },
  founder: {
    font: 'MaterialIcons',
    name: 'flight-takeoff',
  },
  verified: {
    font: 'MaterialIcons',
    name: 'verified-user',
    ratio: 0.98,
  },
  'thumb-up': {
    font: 'MaterialIcons',
    name: 'thumb-up',
    ratio: 0.96,
  },
  'thumb-down': {
    font: 'MaterialIcons',
    name: 'thumb-down',
    ratio: 0.96,
  },
  'account-multi': {
    font: 'MaterialCommunityIcons',
    name: 'account-box-multiple',
  },
  'chat-off': {
    font: 'MaterialIcons',
    name: 'speaker-notes-off',
    top: 2,
  },
  remind: {
    font: 'MaterialCommunityIcons',
    name: 'repeat',
    ratio: 1.04,
    top: -1,
  },
  boost: {
    font: 'MaterialCommunityIcons',
    name: 'trending-up',
    ratio: 1.04,
  },
  share: {
    font: 'MaterialIcons',
    name: 'ios-share',
    top: -2,
  },
  'share-alt': {
    font: 'MaterialCommunityIcons',
    name: 'share-variant',
    ratio: 0.96,
  },
  plus: {
    font: 'MaterialCommunityIcons',
    name: 'plus',
  },
  check: {
    font: 'MaterialCommunityIcons',
    name: 'check',
  },
  'checkbox-marked': {
    font: 'MaterialCommunityIcons',
    name: 'checkbox-marked',
  },
  'checkbox-blank': {
    font: 'MaterialCommunityIcons',
    name: 'checkbox-blank-outline',
  },
  'plus-circle-outline': {
    font: 'MaterialIcons',
    name: 'add-circle-outline',
  },
  'plus-circle': {
    font: 'MaterialCommunityIcons',
    name: 'plus-circle',
  },
  user: {
    font: 'EvilIcons',
    name: 'user',
    ratio: 1.05,
  },
  profile: {
    font: 'MaterialIcons',
    name: 'person',
  },
  chat: {
    font: 'MaterialIcons',
    name: 'message',
    ratio: 0.92,
    top: 2,
  },
  'chat-solid': {
    font: 'MaterialCommunityIcons',
    name: 'message',
    ratio: 0.92,
    top: 2,
  },
  'chevron-left': {
    font: 'MaterialCommunityIcons',
    name: 'chevron-left',
    ratio: 1,
  },
  'chevron-right': {
    font: 'MaterialCommunityIcons',
    name: 'chevron-right',
    ratio: 1,
  },
  'chevron-down': {
    font: 'MaterialCommunityIcons',
    name: 'chevron-down',
    ratio: 1,
  },
  'chevron-up': {
    font: 'MaterialCommunityIcons',
    name: 'chevron-up',
    ratio: 1,
  },
  home: {
    font: 'Entypo',
    name: 'home',
    ratio: 0.96,
  },
  bank: {
    font: 'MaterialCommunityIcons',
    name: 'bank',
  },
  settings: {
    font: 'MaterialIcons',
    name: 'settings',
  },
  group: {
    font: 'MaterialCommunityIcons',
    name: 'account-multiple',
  },
  coins: {
    font: 'FontAwesome5',
    name: 'coins',
    ratio: 0.92,
  },
  money: {
    font: 'MaterialIcons',
    name: 'attach-money',
    ratio: 1.04,
  },
  analytics: {
    font: 'MaterialIcons',
    name: 'insights',
  },
  queue: {
    font: 'MaterialIcons',
    name: 'add-to-queue',
  },
  search: {
    font: 'IonIcon',
    name: 'search',
    ratio: 0.96,
  },
  notification: {
    font: 'MaterialCommunityIcons',
    name: 'bell',
    ratio: 0.94,
    top: -2,
  },
  menu: {
    font: 'IonIcon',
    name: 'menu',
  },
  hashtag: {
    font: 'Fontisto',
    name: 'hashtag',
    ratio: 0.86,
  },
  'close-circle': {
    font: 'MaterialCommunityIcons',
    name: 'close-circle',
  },
  edit: {
    font: 'Feather',
    name: 'edit',
  },
  download: {
    font: 'Feather',
    name: 'download',
  },
  tune: {
    font: 'MaterialCommunityIcons',
    name: 'tune',
  },
  'external-link': {
    font: 'Feather',
    name: 'external-link',
    ratio: 0.8,
  },
  'arrow-up': {
    font: 'MaterialCommunityIcons',
    name: 'arrow-up',
  },
  'arrow-right': {
    font: 'MaterialCommunityIcons',
    name: 'arrow-right',
  },
  sms: {
    font: 'MaterialIcons',
    name: 'sms',
  },
  'date-range': {
    font: 'MaterialIcons',
    name: 'date-range',
  },
  delete: {
    font: 'MaterialIcons',
    name: 'delete',
  },
  'login-variant': {
    font: 'MaterialCommunityIcons',
    name: 'login-variant',
  },
  logout: {
    font: 'MaterialIcons',
    name: 'logout',
  },
  'flag-outline': {
    font: 'IonIcon',
    name: 'flag-outline',
  },
  'share-social': {
    font: 'IonIcon',
    name: 'share-social',
  },
  'remove-circle': {
    font: 'IonIcon',
    name: 'remove-circle-outline',
  },
  'add-circle': {
    font: 'IonIcon',
    name: 'add-circle-outline',
  },
  'radio-button-on': {
    font: 'MaterialIcons',
    name: 'radio-button-on',
  },
  'radio-button-off': {
    font: 'MaterialIcons',
    name: 'radio-button-off',
  },
  'md-checkmark': {
    font: 'IonIcon',
    name: 'md-checkmark',
  },
  checkmark: {
    font: 'IonIcon',
    name: 'checkmark',
  },
  facebook: {
    font: 'Fontisto',
    name: 'facebook',
  },
  twitter: {
    font: 'Fontisto',
    name: 'twitter',
    ratio: 0.8,
  },
  email: {
    font: 'MaterialIcons',
    name: 'email',
  },
  'alpha-s-circle': {
    font: 'MaterialCommunityIcons',
    name: 'alpha-s-circle',
  },
  network: {
    font: 'MaterialCommunityIcons',
    name: 'network-outline',
  },
  web_plus: {
    font: 'MaterialCommunityIcons',
    name: 'web-plus',
  },
  palette_swatch: {
    font: 'MaterialCommunityIcons',
    name: 'palette-swatch-variant',
  },
  pencil: {
    font: 'MaterialCommunityIcons',
    name: 'pencil',
  },
  account_edit: {
    font: 'MaterialCommunityIcons',
    name: 'account-edit',
  },
  rocket: {
    font: 'MaterialCommunityIcons',
    name: 'rocket-launch',
  },
  eye_off: {
    font: 'IonIcon',
    name: 'eye-off',
  },
  alarm: {
    font: 'MaterialIcons',
    name: 'alarm',
  },
  affiliate: {
    font: 'MaterialCommunityIcons',
    name: 'hand-heart',
  },
  article: {
    font: 'MaterialIcons',
    name: 'article',
  },
  attach_money: {
    font: 'MaterialIcons',
    name: 'attach-money',
  },
  ads_click: {
    font: 'MaterialIcons',
    name: 'ads-click',
  },
  insights: {
    font: 'MaterialIcons',
    name: 'insights',
  },
  ssid_chart: {
    font: 'MaterialIcons',
    name: 'equalizer',
  },
  shopping_bag: {
    font: 'MaterialIcons',
    name: 'shopping-bag',
  },
  hub: {
    font: 'MaterialIcons',
    name: 'grain',
  },
  trending_up: {
    font: 'MaterialIcons',
    name: 'trending-up',
  },
  dynamic_feed: {
    font: 'MaterialIcons',
    name: 'dynamic-feed',
  },
  groups: {
    font: 'MaterialIcons',
    name: 'groups',
  },
  lock_open: {
    font: 'MaterialIcons',
    name: 'lock-open',
  },
  add_to_queue: {
    font: 'MaterialIcons',
    name: 'add-to-queue',
  },
  payments: {
    font: 'MaterialIcons',
    name: 'payments',
  },
  star: {
    font: 'MaterialIcons',
    name: 'star',
  },
  account_balance_wallet: {
    font: 'MaterialIcons',
    name: 'account-balance-wallet',
  },
  'triangle-down': {
    font: 'MaterialIcons',
    name: 'play-arrow',
    transform: [{ rotate: '90deg' }],
  },
  'triangle-up': {
    font: 'MaterialIcons',
    name: 'play-arrow',
    transform: [{ rotate: '270deg' }],
  },
  globe: {
    font: 'MaterialIcons',
    name: 'language',
  },
  ignite: {
    font: 'MaterialIcons',
    name: 'local-fire-department',
  },
  'pause-circle': {
    font: 'MaterialIcons',
    name: 'pause-circle',
  },
  'play-circle': {
    font: 'MaterialIcons',
    name: 'play-circle',
  },
  'playlist-add': {
    font: 'MaterialIcons',
    name: 'playlist-add',
  },
  'playlist-remove': {
    font: 'MaterialIcons',
    name: 'playlist-remove',
  },
  'replay-10': {
    font: 'MaterialIcons',
    name: 'replay-10',
  },
  'forward-10': {
    font: 'MaterialIcons',
    name: 'forward-10',
  },
  'download-for-offline': {
    font: 'MaterialIcons',
    name: 'download-for-offline',
  },
  'offline-pin': {
    font: 'MaterialIcons',
    name: 'offline-pin',
  },
  downloading: {
    font: 'MaterialIcons',
    name: 'downloading',
  },
} as const;

export type IconNameType = keyof typeof ICON_MAP;

export type IconMap = Record<IconNameType, Icon>;

export default ICON_MAP as IconMap;
