//@ts-nocheck
import { MINDS_DEEPLINK } from '../../config/Config';
import navigationService from '../../navigation/NavigationService';
import { Linking } from 'react-native';

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
    MINDS_DEEPLINK.forEach((r) => this.add(r[0], r[1]));
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
  add(url, screen) {
    const re = /:(\w+)/gi;

    const params = (url.match(re) || []).map((s) => s.substr(1));

    this.routes.push({
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
    if (!url) return;
    const route = this._getUrlRoute(url);
    if (route && route.screen !== 'Redirect') {
      navigationService.push(route.screen, route.params);
    } else {
      Linking.openURL(url.replace('https://www.', 'https://mobile.'));
    }
    return !!route;
  }

  cleanUrl(url) {
    return url
      .replace(/^(http(s)?(:\/\/))?(www\.)?[a-zA-Z0-9-_\.]+\//, '')
      .replace('mindsapp://', '');
  }

  /**
   * get url for given route
   * @param {string} url
   */
  _getUrlRoute(url) {
    const surl = this.cleanUrl(url);

    for (var i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const match = route.re.exec(surl);
      if (match) {
        const params = {};
        route.params.forEach((v, i) => (params[v] = match[i + 1]));
        const urlParams = this.parseQueryParams(url);

        return { screen: route.screen, params: { ...params, ...urlParams } };
      }
    }
    return null;
  }
}

export default new DeeplinksRouter();
