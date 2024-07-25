// Import the class after mocks to ensure dependencies are mocked
import { AuthService } from '~/auth/AuthService';
import { ApiService } from '~/common/services/api.service';
import { LogService } from '~/common/services/log.service';
import { SessionService } from '~/common/services/session.service';
import { NavigationService } from '~/navigation/NavigationService';
import { I18nService } from '~/common/services/i18n.service';
import { MindsConfigService } from '~/common/services/minds-config.service';
import delay from '~/common/helpers/delay';

// Mock dependencies
jest.mock('~/common/services/api.service');
jest.mock('~/common/services/log.service');
jest.mock('~/common/services/session.service');
jest.mock('~/navigation/NavigationService');
jest.mock('~/common/services/i18n.service');
jest.mock('~/common/services/minds-config.service');
jest.mock('~/common/helpers/delay');
jest.mock('~/auth/multi-user/resetStackAndGoBack');

// Setup common variables
let authService: AuthService;
let apiService: ApiService;
let logService: LogService;
let sessionService: SessionService;
let navigationService: NavigationService;
let i18nService: I18nService;
let configService: MindsConfigService;

beforeEach(() => {
  // Initialize the mocked services
  apiService = new ApiService();
  logService = new LogService();
  sessionService = new SessionService();
  sessionService.sessions = [];
  navigationService = new NavigationService();
  i18nService = new I18nService();
  configService = new MindsConfigService();
  delay.mockResolvedValue();

  // Create an instance of AuthService with mocked dependencies
  authService = new AuthService(
    apiService,
    logService,
    sessionService,
    navigationService,
    i18nService,
    configService,
  );
});

describe('AuthService.login', () => {
  it('should successfully log in a user', async () => {
    // Mock API response
    apiService.rawPost.mockResolvedValue({
      data: {
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token',
        token_type: 'Bearer',
        pseudo_id: 'test_pseudo_id',
      },
      headers: {
        'set-cookie': ['minds_pseudoid=test_pseudo_id;'],
      },
    });

    // Mock session and other dependencies as needed
    sessionService.isRelogin.mockReturnValue(false);
    sessionService.addOAuthSession.mockResolvedValue(undefined);
    sessionService.login.mockResolvedValue(undefined);

    // Call the method

    const result = await authService.login('testuser', 'password');
    // Assertions
    expect(result.access_token).toEqual('test_access_token');
    expect(apiService.clearCookies).toHaveBeenCalled();
    expect(sessionService.addOAuthSession).toHaveBeenCalled();
    expect(sessionService.login).toHaveBeenCalled();
  });

  // Add more tests here for error cases, newUser logic, etc.
});

describe('AuthService.logout', () => {
  it('should successfully log out a user', async () => {
    // Mock dependencies
    sessionService.sessionsCount = 1;
    navigationService.getCurrentState.mockReturnValue({ name: 'HomeScreen' });

    // Mock API call
    apiService.post.mockResolvedValue(undefined);

    // Call the method
    const result = await authService.logout();

    // Assertions
    expect(result).toBe(true);
    expect(apiService.post).toHaveBeenCalledWith('api/v3/oauth/revoke');
    expect(sessionService.logout).toHaveBeenCalled();
  });

  // Add more tests here for preLogoutCallBack, error handling, etc.
});
