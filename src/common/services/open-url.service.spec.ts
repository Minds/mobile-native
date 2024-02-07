import { OpenURLService } from './open-url.service';
import { Linking, Alert } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { storages } from './storage/storages.service';
import deeplinksRouterService from './deeplinks-router.service';

const mockedAppStorage = storages.app as jest.Mocked<typeof storages.app>;
const mockedInAppBrowser = InAppBrowser as jest.Mocked<typeof InAppBrowser>;

// ### Mocks ###
jest.mock('./analytics.service.ts', () => ({
  AnalyticsService: jest.fn().mockImplementation(() => ({
    trackScreenView: jest.fn(),
    trackEvent: jest.fn(),
  })),
}));

jest.mock('./deeplinks-router.service.ts', () => ({
  navigate: jest.fn(),
}));

jest.mock('../../config/Config', () => ({
  MINDS_URI: 'https://www.minds.com',
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

jest.mock('~/navigation/NavigationService', () => ({
  navigate: jest.fn(),
  push: jest.fn(),
}));

// ### Tests ###
describe('OpenURLService', () => {
  let service;

  beforeEach(() => {
    service = new OpenURLService();
  });

  it('should initialize with preferred browser from storage', () => {
    mockedAppStorage.getInt.mockReturnValue(1);
    service.init();
    expect(service.preferredBrowser).toBe(1);
  });

  it('should set preferred browser and store it', () => {
    service.setPreferredBrowser(0);
    expect(service.preferredBrowser).toBe(0);
    expect(storages.app.setInt).toHaveBeenCalledWith('openLinksBrowser', 0);
  });

  it('should open link in in-app browser if available', async () => {
    mockedInAppBrowser.isAvailable.mockResolvedValue(true);
    await service.openLinkInInAppBrowser('https://example.com');
    expect(mockedInAppBrowser.open).toHaveBeenCalledWith(
      'https://example.com',
      expect.any(Object),
    );
  });

  it('should open link in default browser if in-app browser not available', async () => {
    mockedInAppBrowser.isAvailable.mockResolvedValue(false);
    await service.openLinkInInAppBrowser('https://example.com');
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle error when opening link in in-app browser', async () => {
    mockedInAppBrowser.isAvailable.mockRejectedValue(
      new Error('Error message'),
    );
    await service.openLinkInInAppBrowser('https://example.com');
    expect(Alert.alert).toHaveBeenCalledWith('Error message');
  });

  it('should open link in deeplink router if it is the apps domain', async () => {
    await service.open('https://www.minds.com/wallet');
    expect(deeplinksRouterService.navigate).toHaveBeenCalledWith(
      'https://www.minds.com/wallet',
    );
  });

  it('should open link in deeplink router if it is the apps domain without https://www.', async () => {
    await service.open('minds.com/wallet');
    expect(deeplinksRouterService.navigate).toHaveBeenCalledWith(
      'https://www.minds.com/wallet',
    );
  });

  it('should open link in default browser if it is selected', async () => {
    service.setPreferredBrowser(0);
    await service.open('https://example.com');
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('should open link in in-app browser if it is selected', async () => {
    service.setPreferredBrowser(1);
    mockedInAppBrowser.isAvailable.mockResolvedValue(true);
    await service.open('https://example.com');
    expect(mockedInAppBrowser.open).toHaveBeenCalledWith(
      'https://example.com',
      expect.any(Object),
    );
  });
});
