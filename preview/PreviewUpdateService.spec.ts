import * as Updates from 'expo-updates';
import PreviewUpdateService from './PreviewUpdateService';
import { showNotification } from 'AppMessages';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
const storagesService = sp.mockService('storages');
const logService = sp.mockService('log');

jest.mock('expo-application', () => ({
  nativeApplicationVersion: '1.0.0',
}));
jest.mock('expo-updates', () => ({
  checkForUpdateAsync: jest.fn(),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}));

jest.mock('AppMessages', () => ({
  showNotification: jest.fn(),
}));

const mockedUpdates = Updates as jest.Mocked<typeof Updates>;

describe('PreviewUpdateService', () => {
  const mockChannel = 'testChannel';
  const previewUpdate = new PreviewUpdateService(
    sp.resolve('storages'),
    sp.resolve('log'),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check for update, fetch update, clear session, and reload if update is available', async () => {
    (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({
      isAvailable: true,
    });
    mockedUpdates.fetchUpdateAsync.mockResolvedValueOnce({} as any);
    mockedUpdates.reloadAsync.mockResolvedValueOnce();

    await previewUpdate.updatePreview(mockChannel);

    expect(Updates.checkForUpdateAsync).toHaveBeenCalledWith(mockChannel);
    expect(showNotification).toHaveBeenCalledWith('Downloading demo app...');
    expect(Updates.fetchUpdateAsync).toHaveBeenCalledTimes(1);
    expect(Updates.fetchUpdateAsync).toHaveBeenCalledWith(mockChannel);
    expect(storagesService.session.clearAll).toHaveBeenCalled();
    expect(Updates.reloadAsync).toHaveBeenCalled();
  });

  it('should show notification if no update is available', async () => {
    (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({
      isAvailable: false,
    });

    await previewUpdate.updatePreview(mockChannel);

    expect(Updates.checkForUpdateAsync).toHaveBeenCalledWith(mockChannel);
    expect(showNotification).toHaveBeenCalledWith('Demo is not ready yet.');
  });

  it('should log error and rethrow if error occurs during update check', async () => {
    const mockError = new Error('Update check failed');
    (Updates.checkForUpdateAsync as jest.Mock).mockRejectedValue(mockError);

    await expect(previewUpdate.updatePreview(mockChannel)).rejects.toThrow(
      mockError,
    );

    expect(Updates.checkForUpdateAsync).toHaveBeenCalledWith(mockChannel);
    expect(showNotification).toHaveBeenCalledWith('Error installing demo app');
    expect(logService.error).toHaveBeenCalledWith(mockError);
  });

  it('should update if the version is the same', () => {
    const url = 'mindspreview://preview/testChannel?version=1.0.0';
    const result = previewUpdate.checkAppVersion(url);

    expect(result).toBe(true);
  });

  it('should show message if the version is the lower', () => {
    const url = 'mindspreview://preview/testChannel?version=1.1.0';
    const result = previewUpdate.checkAppVersion(url);
    expect(showNotification).toHaveBeenCalledWith(
      'This preview requires the version 1.1.0 of the Previewer, please update.',
    );
    expect(result).toBe(false);
  });

  it('should show message if the version is the higher', () => {
    const url = 'mindspreview://preview/testChannel?version=0.9.0';
    const result = previewUpdate.checkAppVersion(url);
    expect(showNotification).toHaveBeenCalledWith(
      'This preview was build for an old version, please create a new one from the admin panel.',
    );
    expect(result).toBe(false);
  });

  it('should install if no version is specified', () => {
    const url = 'mindspreview://preview/testChannel';
    const result = previewUpdate.checkAppVersion(url);
    expect(result).toBe(true);
  });

  it('should return the channel if the version matches', () => {
    const url = 'mindspreview://preview/testChannel?version=1.0.0';
    const result = previewUpdate.getPreviewChannel(url);
    expect(result).toBe('testChannel');
  });

  it('should not return the channel if the version is not the same', () => {
    const url = 'mindspreview://preview/testChannel?version=1.1.0';
    const result = previewUpdate.getPreviewChannel(url);
    expect(result).toBe(undefined);
  });
});
