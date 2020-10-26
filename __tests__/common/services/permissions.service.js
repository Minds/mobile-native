import service from '../../../src/common/services/permissions.service';
import { request, check, PERMISSIONS } from 'react-native-permissions';

jest.mock('react-native-permissions');
/**
 * Tests
 */
describe('Push service', () => {
  beforeEach(() => {
    check.mockClear();
    request.mockClear();
  });
  it('should read external storage', async () => {
    service.readExternalStorage();
    expect(request).toBeCalledWith(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, {
      buttonNegative: 'No',
      buttonPositive: 'Grant',
      message:
        'Minds needs access to your external storage so you can upload images and videos.',
      title: 'Minds',
    });
  });

  it('should check camera and resolve', async () => {
    check.mockResolvedValue('granted');
    await service.checkCamera();
    expect(check).toBeCalledWith(PERMISSIONS.IOS.CAMERA);
  });

  it('should check external storage write permission', async () => {
    check.mockResolvedValue('granted');
    await service.checkWriteExternalStorage();
    expect(check).toBeCalledWith(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
  });

  it('should write external storage', async () => {
    check.mockResolvedValue('granted');
    await service.writeExternalStorage();
    expect(request).toBeCalledWith(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, {
      buttonNegative: 'No',
      buttonPositive: 'Grant',
      message:
        'Minds needs access to your external storage so you can download images and videos.',
      title: 'Minds',
    });
  });

  it('should request camera', async () => {
    request.mockResolvedValue('granted');
    await service.camera();
    expect(request).toBeCalledWith(PERMISSIONS.IOS.CAMERA, {
      buttonNegative: 'No',
      buttonPositive: 'Grant',
      message:
        'Minds needs access to your external camera so you can capture pictures.',
      title: 'Minds',
    });
  });
});
