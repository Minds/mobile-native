import { waitFor } from '@testing-library/react-native';
import AuthService from '../../auth/AuthService';
import { SessionService } from './session.service';
import {
  AuthType,
  SessionStorageService,
} from './storage/session.storage.service';
import * as configConstants from '../../config/Config';
import analyticsService from './analytics.service';
import CookieManager from '@react-native-cookies/cookies';

// Mock external services and modules
jest.mock('../../../AppStores', () => ({
  getStores: jest.fn(() => ({
    user: {
      setUser: jest.fn(),
      load: async () => ({
        guid: '123',
      }),
      me: {},
    },
  })),
}));
jest.mock('../../auth/AuthService');
jest.mock('./storage/session.storage.service');
jest.mock('./analytics.service');
const mockedAnalyticsService = analyticsService as jest.Mocked<
  typeof analyticsService
>;

const mockedSession = {
  activeIndex: 0,
  tokensData: [
    {
      user: {
        guid: '123',
      },
      pseudoId: 'pseudo_id_here',
      sessionExpired: false,
      authType: AuthType.OAuth,
      refreshToken: {
        refresh_token: '12345',
        refresh_token_expires: Date.now(),
      },
      accessToken: {
        access_token: 'new_access_token.MTIzNA==',
        access_token_expires: Date.now(),
      },
    },
  ],
};

describe('SessionService init', () => {
  let sessionService;
  let sessionStorageMock;

  beforeEach(() => {
    sessionStorageMock = new SessionStorageService();
    sessionService = new SessionService(sessionStorageMock);
  });

  it('init should handle no active sessions', async () => {
    sessionStorageMock.getAll.mockReturnValueOnce(undefined); // Mock no session data
    await sessionService.init();

    expect(sessionService.sessions.length).toBe(0);
    expect(sessionService.userLoggedIn).toBeFalsy();
    expect(sessionService.ready).toBeTruthy();
  });

  it('init should handle stored active sessions', async () => {
    sessionStorageMock.getAll.mockReturnValueOnce(mockedSession);
    await sessionService.init();

    expect(sessionService.sessions.length).toBe(1);
    const session = sessionService.sessions[0];
    expect(session.pseudoId).toBe('pseudo_id_here');
    expect(session.sessionExpired).toBeFalsy();
    expect(session.user.guid).toBe('123');
  });

  it('should set a pseudo id for non tenant', () => {
    sessionStorageMock.getAll.mockReturnValueOnce(mockedSession);
    const mockedConstants = configConstants as { IS_TENANT: boolean };
    mockedConstants.IS_TENANT = false;

    sessionService.init();

    expect(mockedAnalyticsService.setUserId).toHaveBeenCalledWith(
      'pseudo_id_here',
    );
  });

  it('should set a real user id for tenant', () => {
    sessionStorageMock.getAll.mockReturnValueOnce(mockedSession);
    const mockedConstants = configConstants as { IS_TENANT: boolean };
    mockedConstants.IS_TENANT = true;
    sessionService.init();

    expect(mockedAnalyticsService.setUserId).toHaveBeenCalledWith('123');
  });
});

describe('SessionService initialization and token management', () => {
  let sessionService;
  let sessionStorageMock;

  beforeEach(() => {
    sessionStorageMock = new SessionStorageService();
    sessionService = new SessionService(sessionStorageMock);
    AuthService.refreshToken = jest.fn().mockClear();
    sessionService.activeIndex = 0;
  });

  it('should initialize with no active sessions', async () => {
    sessionStorageMock.getAll.mockReturnValueOnce({
      tokensData: [],
      activeIndex: 0,
    });
    await sessionService.init();
    expect(sessionService.sessions.length).toBe(0);
    expect(sessionService.ready).toBeTruthy();
  });

  it('should handle token refresh successfully', async () => {
    sessionService.setRefreshToken('valid_refresh_token');
    sessionService.refreshTokenExpires = Date.now() / 1000 + 5000; // Future expiration
    AuthService.refreshToken = jest.fn().mockResolvedValue({
      access_token: 'new_access_token.MTIzNA==',
      refresh_token: 'new_refresh_token',
    });

    await sessionService.refreshAuthToken();

    expect(sessionService.token).toBe('new_access_token.MTIzNA==');
    expect(sessionService.refreshToken).toBe('new_refresh_token');
    expect(AuthService.refreshToken).toHaveBeenCalled();
  });

  it('should not refresh token if it cannot refresh', async () => {
    sessionService.setRefreshToken('expired_refresh_token');
    sessionService.refreshTokenExpires = Date.now() / 1000 - 5000; // Past expiration

    await expect(sessionService.refreshAuthToken()).rejects.toThrow(
      'Session Expired',
    );
  });
});

describe('SessionService session management', () => {
  let sessionService;
  let sessionStorageMock;

  beforeEach(() => {
    sessionStorageMock = new SessionStorageService();
    sessionService = new SessionService(sessionStorageMock);
  });

  it('should add a new session successfully', async () => {
    sessionStorageMock.getAll.mockReturnValueOnce({
      activeIndex: 0,
      tokensData: [
        {
          user: {
            guid: '123',
          },
          pseudoId: 'pseudo_id_here',
          sessionExpired: false,
          refreshToken: {
            refresh_token: '12345',
            refresh_token_expires: Date.now(),
          },
          accessToken: {
            access_token: 'new_access_token.MTIzNA==',
            access_token_expires: Date.now(),
          },
        },
      ],
    });

    const tokens = {
      access_token: 'access.MTIzNA==',
      refresh_token: 'refresh',
      pseudo_id: 'pseudoId',
    };
    AuthService.refreshToken = jest.fn().mockResolvedValue(tokens);
    await sessionService.addOAuthSession(tokens);

    await waitFor(async () => {
      expect(sessionService.sessions.length).toBe(1);
      expect(sessionService.sessions[0].accessToken.access_token).toBe(
        tokens.access_token,
      );
    });
  });

  it('should switch user successfully', async () => {
    // Setup with two sessions
    sessionService.sessions = [
      {
        authType: AuthType.OAuth,
        accessToken: { access_token: 'token1' },
        refreshToken: { refresh_token: 'refresh1' },
        user: { guid: 'guid1' },
      },
      {
        authType: AuthType.OAuth,
        accessToken: { access_token: 'token2' },
        refreshToken: { refresh_token: 'refresh2' },
        user: { guid: 'guid2' },
      },
    ];
    sessionService.activeIndex = 0;

    await sessionService.switchUser(1);

    expect(sessionService.activeIndex).toBe(1);
    expect(sessionService.token).toBe('token2');
  });

  it('should logout and clear sessions if specified', () => {
    CookieManager.clearAll = jest.fn().mockResolvedValue(null);
    // Prepopulate with a session
    sessionService.sessions = [
      {
        authType: AuthType.OAuth,
        accessToken: { access_token: 'token1' },
        refreshToken: { refresh_token: 'refresh1' },
        user: { guid: 'guid1' },
      },
    ];
    sessionService.activeIndex = 0;

    sessionService.logout();

    expect(sessionService.sessions.length).toBe(0);
    expect(sessionService.userLoggedIn).toBeFalsy();
  });
});

describe('SessionService user and session information', () => {
  let sessionService;

  beforeEach(() => {
    const sessionStorageMock = new SessionStorageService();
    sessionService = new SessionService(sessionStorageMock);
    // Mock sessions setup
    sessionService.sessions = [
      {
        accessToken: { access_token: 'token1' },
        user: { guid: 'guid1', username: 'user1' },
      },
      {
        accessToken: { access_token: 'token2' },
        user: { guid: 'guid2', username: 'user2' },
      },
    ];
  });

  it('should check session index exists', () => {
    expect(sessionService.sessionIndexExists(1)).toBeTruthy();
    expect(sessionService.sessionIndexExists(2)).toBeFalsy();
  });

  it('should return correct session for index', () => {
    const session = sessionService.getSessionForIndex(1);
    expect(session).toBeDefined();
    expect(session.user.username).toBe('user2');
  });

  it('should get the current user', () => {
    const user = sessionService.getUser();
    expect(user).toBeDefined();
  });
});

describe('SessionService with AuthType.Cookie', () => {
  let sessionService;
  let sessionStorageMock;

  beforeEach(() => {
    sessionStorageMock = new SessionStorageService();
    sessionService = new SessionService(sessionStorageMock);
  });

  it('should build XSRF Token on init', async () => {
    mockedSession.tokensData[0].authType = AuthType.Cookie;
    sessionStorageMock.getAll.mockReturnValueOnce(mockedSession);

    CookieManager.get = jest.fn().mockResolvedValue({
      'XSRF-TOKEN': {
        value: 'test-xsrf-token',
      },
    });

    await sessionService.init();

    expect(sessionService.xsrfToken).toBe('test-xsrf-token');
    expect(sessionService.token).toBe('fake-token');
  });

  it('should replace ALL sessions when adding a cookie session', async () => {
    sessionService.sessions = [
      {
        accessToken: { access_token: 'token1' },
        user: { guid: 'guid1', username: 'user1' },
      },
      {
        accessToken: { access_token: 'token2' },
        user: { guid: 'guid2', username: 'user2' },
      },
    ];
    expect(sessionService.sessions.length).toBe(2);

    await sessionService.addCookieSession();

    expect(sessionService.token).toBe('fake-token');
    expect(sessionService.sessions.length).toBe(1);
  });
});
