import * as Updates from 'expo-updates';
import { UpdateExpoService } from './update.expo.service';

jest.mock('expo-updates', () => ({
  checkForUpdateAsync: jest.fn(),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}));

describe('UpdateExpoService', () => {
  let service;
  let mockCheckForUpdateAsync;
  let mockFetchUpdateAsync;
  let mockReloadAsync;

  beforeEach(() => {
    service = new UpdateExpoService();
    mockCheckForUpdateAsync = jest
      .spyOn(Updates, 'checkForUpdateAsync')
      .mockResolvedValue({} as any);
    mockFetchUpdateAsync = jest
      .spyOn(Updates, 'fetchUpdateAsync')
      .mockResolvedValue({} as any);
    mockReloadAsync = jest.spyOn(Updates, 'reloadAsync').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkForUpdate()', () => {
    it('should set isAvailable to true and update manifest when an update is available', async () => {
      const mockManifest = { version: '1.0.1' }; // Mock manifest data
      mockCheckForUpdateAsync.mockReturnValue({
        isAvailable: true,
        manifest: mockManifest,
      });

      const result = await service.checkForUpdate();

      expect(result.isAvailable).toBe(true);
      expect(result.manifest).toEqual(mockManifest);
    });

    it('should set isAvailable to false when no update is available', async () => {
      mockCheckForUpdateAsync.mockResolvedValue({
        isAvailable: false,
      });

      const result = await service.checkForUpdate();

      expect(result.isAvailable).toBe(false);
      expect(result.manifest).toBeUndefined();
    });
  });

  describe('update()', () => {
    it('should fetch update and set isNew and manifest if update is available', async () => {
      const mockUpdateFetchResult = {
        isNew: true,
        manifest: { version: '1.0.2' }, // Mock updated manifest
      };
      mockFetchUpdateAsync.mockResolvedValue(mockUpdateFetchResult);

      // Simulate that an update is available
      service.checkResult = {
        isAvailable: true,
        manifest: { version: '1.0.1' },
      };

      const result = await service.update();
      console.log(result);

      expect(Updates.fetchUpdateAsync).toHaveBeenCalled();
      expect(result.isNew).toBe(true);
      expect(result.manifest).toEqual(mockUpdateFetchResult.manifest);
    });

    it('should log and rethrow error during update fetch', async () => {
      const mockError = new Error('Fetch failed');
      mockFetchUpdateAsync.mockRejectedValue(mockError);

      service.checkResult = {
        isAvailable: true,
        manifest: { version: '1.0.1' },
      };

      await expect(service.update()).rejects.toThrow(mockError);
    });
  });

  describe('reload()', () => {
    it('should reload and reset isUpdatePending if update is pending', async () => {
      mockReloadAsync.mockResolvedValue();
      service.isAvailable = true; // Simulate that an update is pending

      await service.reload();

      expect(Updates.reloadAsync).toHaveBeenCalled();
    });
  });
});
