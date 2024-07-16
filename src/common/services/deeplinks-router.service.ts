import {
  IS_TENANT_PREVIEW,
  APP_API_URI,
  MINDS_DEEPLINK,
  APP_SCHEME_URI,
  IS_TENANT,
  APP_URI,
} from '../../config/Config';
import { Linking } from 'react-native';
import getMatches from '../helpers/getMatches';
import PreviewUpdateService from 'preview/PreviewUpdateService';
import type { AnalyticsService } from './analytics.service';
import type { NavigationService } from '~/navigation/NavigationService';
import type { ApiService } from './api.service';
import type { ReferrerService } from './referrer.service';
import { openLinkInInAppBrowser } from './inapp-browser.service';

/**
 * Deeplinks router
 */
export class DeepLinksRouterService {
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
  constructor(
    private navigation: NavigationService,
    private analytics: AnalyticsService,
    private api: ApiService,
    private referrer: ReferrerService,
  ) {
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
  navigate(url, trackAnalytics = false) {
    if (IS_TENANT_PREVIEW && url && PreviewUpdateService.isPreviewURL(url)) {
      const channel = PreviewUpdateService.getPreviewChannel(url);
      if (!channel) {
        return;
      }
      PreviewUpdateService.updatePreview(channel);
      return;
    }

    const cleanURL = this.cleanUrl(url);

    if (!url || !cleanURL) {
      return;
    }

    // track deeplink event (only for external deep links)
    trackAnalytics && this.analytics.trackDeepLinkReceivedEvent(url);

    if (cleanURL.startsWith('forgot-password')) {
      this.navToPasswordReset(url);
      return true;
    }
    if (url.endsWith('/')) {
      url = url.substr(0, url.length - 1);
    }
    const params = this.parseQueryParams(cleanURL);

    if (params?.referrer) {
      this.referrer.set(params.referrer);
    }

    // if it only include parameters we ignore
    if (cleanURL.startsWith('?')) {
      return false;
    }

    const route = this.getUrlRoute(url, cleanURL);

    // open deeplinks in a webview
    if (
      params &&
      params.webview === '1' &&
      url.startsWith(APP_API_URI || url.startsWith(APP_SCHEME_URI))
    ) {
      this.navigation.navigate('WebView', {
        url: url.replace(APP_SCHEME_URI, APP_API_URI),
        headers: this.api.buildAuthorizationHeader(),
      });
      return true;
    }

    if (route && route.screen !== 'Redirect') {
      const screens = route.screen.split('/');
      if (screens.length === 1) {
        this.navigation[route.type](route.screen, route.params);
      } else {
        const screen = screens.shift();
        const calcParams = this.nestedScreen(screens, route.params);
        this.navigation[route.type](screen, calcParams);
      }
    } else if (url !== APP_API_URI) {
      if (url.startsWith(APP_SCHEME_URI)) {
        // how to avoid redirection loop
        if (IS_TENANT) {
          openLinkInInAppBrowser(url.replace(APP_SCHEME_URI, APP_URI));
        } else {
          Linking.openURL(
            url.replace(APP_SCHEME_URI, 'https://mobile.minds.com/'),
          );
        }
      } else {
        IS_TENANT
          ? openLinkInInAppBrowser(url)
          : Linking.openURL(url.replace('https://www.', 'https://mobile.'));
      }
      return true;
    }
    return !!route;
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

    this.navigation.navigate('ResetPassword', {
      username: params[1],
      code: params[2],
    });
  }
}

// const forceUpdate = async (file: string) => {
//   try {
//     console.log('Custom CodePush ->', file);
//     const response = await fetch(
//       'https://minds-repo.s3.amazonaws.com/android/codepush/' + file,
//     );

//     const update = await response.json();

//     console.log('Custom CodePush JSON', update);
//     forceCodepushCustomBundle(update);
//   } catch (error) {
//     console.log(error);
//   }
// };
