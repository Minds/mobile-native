import { Linking } from 'react-native';
import { DeepLinksRouterService } from './deeplinks-router.service';
import { NavigationService } from '~/navigation/NavigationService';
import { ApiService } from './api.service';
import { AnalyticsService } from './analytics.service';
import { ReferrerService } from './referrer.service';
import PreviewUpdateService from 'preview/PreviewUpdateService';

jest.mock('./api.service');
jest.mock('./analytics.service');
jest.mock('~/navigation/NavigationService');
jest.mock('./referrer.service');
jest.mock('preview/PreviewUpdateService');

Linking.openURL = jest.fn();
// @ts-ignore
const analytics = new AnalyticsService();
// @ts-ignore
const referrer = new ReferrerService();
// @ts-ignore
const mockedApi = new ApiService() as jest.Mocked<ApiService>;
const mockedNavigation =
  // @ts-ignore
  new NavigationService() as jest.Mocked<NavigationService>;
// @ts-ignore
const mockedPreviewUpdate = new PreviewUpdateService();

describe('Deep link router', () => {
  const deeplinkRouter = new DeepLinksRouterService(
    mockedNavigation,
    analytics,
    mockedApi,
    referrer,
    mockedPreviewUpdate,
  );
  beforeEach(() => {
    mockedApi.get.mockClear();
    mockedNavigation.navigate.mockClear();
  });

  it('it should navigate and pass parameters to the screen', () => {
    deeplinkRouter.navigate('https://www.minds.com/composer?text=hello');

    expect(mockedNavigation.navigate).toBeCalledWith('Compose', {
      text: 'hello',
    });
  });

  it('it should redirect unhandled links to mobile.minds.com', () => {
    deeplinkRouter.navigate('https://www.minds.com/nonexistent/rute');

    expect(Linking.openURL).toBeCalledWith(
      'https://mobile.minds.com/nonexistent/rute',
    );
  });

  it('it should open webview', () => {
    deeplinkRouter.navigate('https://www.minds.com/notifications?webview=1');

    expect(mockedNavigation.navigate).toBeCalledWith('WebView', {
      url: 'https://www.minds.com/notifications?webview=1',
    });
  });
});
