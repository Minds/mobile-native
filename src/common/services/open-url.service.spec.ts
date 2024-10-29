import { OpenURLService } from './open-url.service';
import { Linking } from 'react-native';

import { Storages } from './storage/storages.service';
import { DeepLinksRouterService } from './deeplinks-router.service';
import { NavigationService } from '~/navigation/NavigationService';
import { openLinkInInAppBrowser } from './inapp-browser.service';

// ### Mocks ###
jest.mock('react-native-url-polyfill', () => ({
  URL: jest.fn(),
  URLSearchParams: jest.fn(),
}));
jest.mock('./analytics.service');
jest.mock('./deeplinks-router.service');
jest.mock('~/common/services/inapp-browser.service', () => ({
  openLinkInInAppBrowser: jest.fn(),
}));
jest.mock('~/navigation/NavigationService');

jest.mock('../../config/Config', () => ({
  APP_URI: 'https://www.minds.com',
  MINDS_PRO: 'https://www.minds.com/pro',
}));

jest.mock('../../styles/ThemedStyles', () => ({
  getColor: jest.fn(),
}));

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

jest.mock('react-native-inappbrowser-reborn', () => ({
  InAppBrowser: {
    isAvailable: jest.fn(),
    open: jest.fn(),
  },
}));

// ### Tests ###
describe('OpenURLService', () => {
  let service;
  const storages = new Storages();
  const mockedAppStorage = storages.app as jest.Mocked<typeof storages.app>;
  // @ts-ignore
  const navigation = new NavigationService();
  // @ts-ignore
  const deeplink = new DeepLinksRouterService();

  beforeEach(() => {
    service = new OpenURLService(storages, navigation, deeplink);
  });

  it('should initialize with preferred browser from storage', () => {
    mockedAppStorage.getNumber.mockReturnValue(1);
    service.init();
    expect(service.preferredBrowser).toBe(1);
  });

  it('should set preferred browser and store it', () => {
    service.setPreferredBrowser(0);
    expect(service.preferredBrowser).toBe(0);
    expect(mockedAppStorage.set).toHaveBeenCalledWith('openLinksBrowser', 0);
  });

  it('should open link in deeplink router if it is the apps domain', async () => {
    await service.open('https://www.minds.com/wallet');
    expect(deeplink.navigate).toHaveBeenCalledWith(
      'https://www.minds.com/wallet',
    );
  });

  it('should open link in deeplink router if it is the apps domain without https://www.', async () => {
    await service.open('minds.com/wallet');
    expect(deeplink.navigate).toHaveBeenCalledWith(
      'https://www.minds.com/wallet',
    );
  });

  it('should open link in default browser if it is selected', async () => {
    service.setPreferredBrowser(1);
    await service.open('https://example.com');
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('should open link in in-app browser if it is selected', async () => {
    service.setPreferredBrowser(0);
    await service.open('https://example.com');
    expect(openLinkInInAppBrowser).toHaveBeenCalledWith('https://example.com');
  });
});
