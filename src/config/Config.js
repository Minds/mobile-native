import { 
  Platform
} from 'react-native';

// export const MINDS_URI = 'https://www.minds.com/';
// export const MINDS_URI = 'http://dev.minds.io/';

// remember to update deeplink uri on AndroidManifest.xml !!!
export const MINDS_URI = 'https://walrus.minds.com/';

export const MINDS_URI_SETTINGS = {
  basicAuth: 'crypto:ohms',
};

export const SOCKET_URI = 'wss://ha-socket-io-us-east-1.minds.com:3030'

export const MINDS_CDN_URI = 'https://d3ae0shxev0cb7.cloudfront.net/';
// export const MINDS_CDN_URI = 'http://dev.minds.io/';

export const BLOCKCHAIN_URI = 'https://rinkeby.infura.io/';
// export const BLOCKCHAIN_URI = 'http://localhost:9545';

export const MINDS_FEATURES = {
  crypto: Platform.OS === 'ios' ? false : true,
  monetization: true,
  legacy: false,
};

/**
 * Deeplink to screen/params maping
 */
export const MINDS_DEEPLINK = [
  ['newsfeed/:guid', 'Activity'],
  ['blog/view/:guid', 'BlogView'],
  [':username', 'Channel'],
]
