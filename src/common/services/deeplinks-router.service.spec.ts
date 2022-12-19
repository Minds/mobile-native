import { Linking } from 'react-native';
import deeplinkRouter from './deeplinks-router.service';
import navigationService from '~/navigation/NavigationService';
import apiService from './api.service';

jest.mock('./api.service');
jest.mock('./analytics.service');
jest.mock('~/navigation/NavigationService');

Linking.openURL = jest.fn();

const mockedApi = apiService as jest.Mocked<typeof apiService>;
const mockedNavigation = navigationService as jest.Mocked<
  typeof navigationService
>;

describe('Deep link router', () => {
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
