import { ApiService } from './api.service';
import { ApiResponse } from './ApiResponse';
import { MindsConfigService } from './minds-config.service';
import { Storages } from '~/common/services/storage/storages.service';

jest.mock('../helpers/delay', () =>
  jest.fn().mockImplementation(_ => new Promise<void>(resolve => resolve())),
);
jest.mock('./api.service');
jest.mock('~/common/services/storage/storages.service');

// @ts-ignore
const apiService = new ApiService();
const storagesService = new Storages();
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('MindsConfigService', () => {
  let service: MindsConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MindsConfigService(mockedApiService, storagesService);
  });

  it('should fetch minds config and update settings', async () => {
    const mockSettings: ApiResponse & { permissions: string[] } = {
      permissions: ['permission1', 'permission2'],
      status: 'success',
    };
    mockedApiService.get.mockResolvedValue(mockSettings);

    await service.update(3);

    expect(mockedApiService.get).toHaveBeenCalledWith('api/v1/minds/config');
    expect(storagesService.user?.setObject).toHaveBeenCalledWith(
      'mindsSettings',
      {
        ...mockSettings,
        permissions: {
          permission1: true,
          permission2: true,
        },
      },
    );
    expect(service.settings).toEqual({
      ...mockSettings,
      permissions: {
        permission1: true,
        permission2: true,
      },
    });
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
