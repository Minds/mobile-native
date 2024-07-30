import apiService, { ApiResponse } from './api.service';
import { MindsConfigService } from './minds-config.service';
import { storages } from './storage/storages.service';
import { TokenExpiredError } from './TokenExpiredError';

type SettingsResponse = ApiResponse & {
  permissions: string[];
  LoggedIn: boolean;
};

jest.mock('../helpers/delay', () =>
  jest.fn().mockImplementation(_ => new Promise<void>(resolve => resolve())),
);
jest.mock('./api.service', () => ({
  get: jest.fn(),
}));

jest.mock('./session.service', () => ({
  userLoggedIn: true,
}));

const mockedApiService = apiService as jest.Mocked<typeof apiService>;

jest.mock('./storage/storages.service', () => ({
  user: {
    setMap: jest.fn(),
    getMap: jest.fn(),
  },
}));

describe('MindsConfigService', () => {
  let service: MindsConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MindsConfigService();
  });

  it('should fetch minds config and update settings', async () => {
    const mockSettings: ApiResponse & {
      permissions: string[];
      LoggedIn: boolean;
    } = {
      LoggedIn: true,
      permissions: ['permission1', 'permission2'],
      status: 'success',
    };
    mockedApiService.get.mockResolvedValue(mockSettings);

    await service.update(3);

    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/minds/config');
    expect(storages.user?.setMap).toHaveBeenCalledWith('mindsSettings', {
      ...mockSettings,
      permissions: {
        permission1: true,
        permission2: true,
      },
    });
    expect(service.settings).toEqual({
      ...mockSettings,
      permissions: {
        permission1: true,
        permission2: true,
      },
    });
  });

  it('should refresh the session if necessary and update settings', async () => {
    const mockSettings: SettingsResponse = {
      LoggedIn: false,
      permissions: [],
      status: 'success',
    };
    const mockSettingsTrue: SettingsResponse = {
      LoggedIn: true,
      permissions: ['permission1', 'permission2'],
      status: 'success',
    };
    mockedApiService.get.mockResolvedValueOnce(mockSettings);
    // @ts-ignore
    mockedApiService.get.mockResolvedValueOnce({ guid: '123' });
    mockedApiService.get.mockResolvedValueOnce(mockSettingsTrue);

    await service.update(3);

    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/minds/config');
    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/channel/me');
    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/minds/config');

    expect(service.settings).toEqual({
      ...mockSettingsTrue,
      permissions: {
        permission1: true,
        permission2: true,
      },
    });
  });

  it('should throw if refresh token is expired', async () => {
    const mockSettings: SettingsResponse = {
      LoggedIn: false,
      permissions: [],
      status: 'success',
    };

    const mockError = new TokenExpiredError();

    mockedApiService.get.mockResolvedValueOnce(mockSettings);
    mockedApiService.get.mockRejectedValueOnce(mockError);

    await expect(service.update(3)).rejects.toThrow(mockError);

    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/minds/config');
    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/channel/me');
    expect(mockedApiService.get).toHaveBeenCalledTimes(2);
  });

  it('should throw if refresh token fails', async () => {
    const mockSettings: SettingsResponse = {
      LoggedIn: false,
      permissions: [],
      status: 'success',
    };
    const mockError = { response: { status: 401 } };

    mockedApiService.get.mockResolvedValueOnce(mockSettings);
    mockedApiService.get.mockRejectedValueOnce(mockError);

    await expect(service.update(3)).rejects.toBe(mockError);

    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/minds/config');
    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/channel/me');
    expect(mockedApiService.get).toHaveBeenCalledTimes(2);
  });

  it('should retry on error', async () => {
    const mockError = new Error('Fetch failed');
    mockedApiService.get.mockRejectedValue(mockError);

    try {
      await service.update(3);
    } catch (error) {
      expect(apiService.get).toHaveBeenCalledTimes(4); // 1 initial call + 3 retries
      expect(error).toBe(mockError);
    }
  });

  it('should throw error after retries exhausted', async () => {
    const mockError = new Error('Fetch failed');
    mockedApiService.get.mockRejectedValue(mockError);

    await expect(service.update(0)).rejects.toThrow(mockError);
    expect(mockedApiService.get).toHaveBeenCalledTimes(1); // only 1 call as no retries
  });
});
