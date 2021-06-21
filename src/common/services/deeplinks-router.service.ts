//@ts-nocheck
import { MINDS_DEEPLINK } from '../../config/Config';
import navigationService from '../../navigation/NavigationService';
import { Linking } from 'react-native';
import getMatches from '../helpers/getMatches';

/**
 * Deeplinks router
 */
class DeeplinksRouter {
  /**
   * Routes
   */
  routes = [];

  /**
   * Constructor
   */
  constructor() {
    MINDS_DEEPLINK.forEach(r => this.add(r[0], r[1], r[2]));
  }

  /**
   * Clear routes
   */
  clearRoutes() {
    this.routes = [];
  }

  /**
   * Parse params
   * @param {string} url
   */
  parseQueryParams(url) {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;

    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    return params;
  }

  /**
   * Add a new route
   * @param {string} url     ex: newsfeed/:guid
   * @param {string} screen  name of the screen
   */
  add(url, screen, type) {
    const re = /:(\w+)/gi;

    const params = (url.match(re) || []).map(s => s.substr(1));

    this.routes.push({
      type: type || 'push',
      screen,
      params,
      re: new RegExp('^' + url.replace(re, '([^/]+?)') + '(/?$|/?\\?)'),
    });
  }

  /**
   * navigate to route
   * @param {string} url
   */
  navigate(url) {
    const cleanURL = this.cleanUrl(url);
    if (!url || !cleanURL) {
      return;
    }
    if (cleanURL.startsWith('forgot-password')) {
      this.navToPasswordReset(url);
      return true;
    }
    if (url.endsWith('/')) {
      url = url.substr(0, url.length - 1);
    }
    const route = this._getUrlRoute(url, cleanURL);

    if (route && route.screen !== 'Redirect') {
      const screens = route.screen.split('/');
      if (screens.length === 1) {
        navigationService[route.type](route.screen, route.params);
      } else {
        const screen = screens.shift();
        const calcParams = this.nestedScreen(screens, route.params);
        navigationService[route.type](screen, calcParams);
      }
    } else if (url !== 'https://www.minds.com') {
      Linking.openURL(url.replace('https://www.', 'https://mobile.'));
    }
    return !!route;
  }

  nestedScreen(data, params) {
    const o = {
      screen: data.shift(),
    };
    if (data.length > 0) {
      o.params = this.nestedScreen(data, params);
    } else {
      o.params = params;
    }

    return o;
  }

  cleanUrl(url) {
    return url
      .replace(/^(http(s)?(:\/\/))?(www\.)?[a-zA-Z0-9-_\.]+\//, '')
      .replace('mindsapp://', '');
  }

  /**
   * Get url for given route
   */
  _getUrlRoute(url, cleanURL) {
    for (var i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const match = route.re.exec(cleanURL);
      if (match) {
        const params = {};
        route.params.forEach((v, i) => (params[v] = match[i + 1]));
        const urlParams = this.parseQueryParams(url);

        return {
          screen: route.screen,
          params: { ...params, ...urlParams },
          type: route.type,
        };
      }
    }
    return null;
  }

  navToPasswordReset(link) {
    const regex = /;username=(.*);code=(.*)/g;

    const params = getMatches(link.replace(/%3B/g, ';'), regex);

    //sessionService.logout();
    navigationService.navigate('Forgot', {
      username: params[1],
      code: params[2],
    });
  }
}

export default new DeeplinksRouter();
