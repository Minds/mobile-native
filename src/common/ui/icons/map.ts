export type IconMapNameType = keyof typeof ICON_MAP;

type IconMap = {
  font: string;
  name: string;
  ratio?: number;
  top?: number;
};
const ICON_MAP: {
  [name: string]: IconMap;
} = {
  dev: {
    font: 'MaterialCommunityIcons',
    name: 'dev-to',
  },
  info: {
    font: 'MaterialCommunityIcons',
    name: 'information-variant',
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
    name: 'ios-camera-sharp',
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
  chatOff: {
    font: 'MaterialCommunityIcons',
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
  chat: {
    font: 'MaterialCommunityIcons',
    name: 'message-outline',
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
    name: 'analytics',
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
    name: 'ios-menu',
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
};

export default ICON_MAP;
