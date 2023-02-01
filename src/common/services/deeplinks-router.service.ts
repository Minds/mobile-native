import { MINDS_DEEPLINK } from '../../config/Config';
import navigationService from '../../navigation/NavigationService';
import { Alert, Linking } from 'react-native';
import getMatches from '../helpers/getMatches';
import analyticsService from '~/common/services/analytics.service';
import apiService from './api.service';

/**
 * Deeplinks router
 */
class DeeplinksRouter {
  /**
   * Routes
   */
  routes: {
    type: string;
    screen: string;
    params: string[];
    routeParams: Record<string, any>;
    re: RegExp;
  }[] = [];

  /**
   * Constructor
   */
  constructor() {
    MINDS_DEEPLINK.forEach(r => this.add(r[0], r[1], r[2], r[3]));
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
      params: any = {},
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
  add(url, screen, type, routeParams) {
    const re = /:(\w+)/gi;

    const params = (url.match(re) || []).map(s => s.substr(1));

    this.routes.push({
      type: type || 'push',
      screen,
      params,
      routeParams,
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
      logger(`failed with url: ${url}\ncleanURL: ${cleanURL}`);
      return;
    }

    // this will track not only deep links, but navigation initiated from push notifs
    analyticsService.trackDeepLinkReceivedEvent(url);

    if (cleanURL.startsWith('forgot-password')) {
      this.navToPasswordReset(url);
      return true;
    }
    url = url
      .replace(/\/$/, '')
      .replace('mindsapp://', 'https://mobile.minds.com/');
    const route = this.getUrlRoute(url, cleanURL);
    logger(`route: ${JSON.stringify(route)}`);

    const params = this.parseQueryParams(cleanURL);

    // open deeplinks in a webview
    if (params?.webview === '1' && url.startsWith('https://www.minds.com/')) {
      logger(`attempting to navigate to WebView: ${url}`);
      navigationService.navigate('WebView', {
        url,
        headers: apiService.buildAuthorizationHeader(),
      });
      return true;
    }

    // in-app routing
    if (route && route.screen !== 'Redirect') {
      logger('attempting to handleUtmParams');
      this.handleUtmParams(url, route);

      const screens = route.screen.split('/');
      const screen = screens.shift();
      const calcParams =
        screens.length === 0
          ? route.params
          : this.nestedScreen(screens, route.params);

      logger(
        `attempting to navigate ${
          route.type
        } to ${screen} with ${JSON.stringify(calcParams)}`,
      );
      navigationService[route.type](screen, calcParams);
      return true;
    }

    // open browser for any other links in mobile mode
    if (url !== 'https://www.minds.com') {
      logger(`attempting to navigate with browser to ${url}`);
      Linking.openURL(url.replace('https://www.', 'https://mobile.'));
      return true;
    }
    logger(`no routes found for ${url}`);
    return !!route;
  }

  /**
   * Handles the UTM campaign forwarding the request to the backend
   */
  private handleUtmParams(url: string, route: Route) {
    if (route.params?.utm_campaign) {
      apiService.get(url);
    }
  }

  nestedScreen(data, params) {
    const o: Record<string, any> = {
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
   * Get route for given url
   */
  private getUrlRoute(url, cleanURL) {
    for (var i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const match = route.re.exec(cleanURL);
      if (match) {
        const params = {};
        route.params.forEach((v, i) => (params[v] = match[i + 1]));
        const urlParams = this.parseQueryParams(url);

        return {
          screen: route.screen,
          params: { ...params, ...urlParams, ...route.routeParams } as any,
          type: route.type,
        };
      }
    }
    return null;
  }

  navToPasswordReset(link) {
    const regex = /;username=(.*);code=(.*)/g;

    const params = getMatches(link.replace(/%3B/g, ';'), regex);

    navigationService.navigate('ResetPassword', {
      username: params[1],
      code: params[2],
    });
  }
}

type Route = NonNullable<ReturnType<DeeplinksRouter['getUrlRoute']>>;

export default new DeeplinksRouter();

const logger = (message: string) => Alert.alert('deeplinks-router', message);
