
import service from '../../../src/common/services/android-permissions.service';
import { PermissionsAndroid } from 'react-native';

jest.mock('react-native', () => ({
  PermissionsAndroid: {
    PERMISSIONS: {
      READ_EXTERNAL_STORAGE: true,
      READ_SMS: true,
      WRITE_EXTERNAL_STORAGE: true,
      CAMERA: true,

    },
    RESULTS: {
      NEVER_ASK_AGAIN: true,
      GRANTED: true,
    },
    check: jest.fn(),
    request: jest.fn()
  }
}));
/**
 * Tests
 */
describe('Push service', () => {
  it('should read external storage', async () => {
    service.readExternalStorage();
    expect(PermissionsAndroid.request).toBeCalled();
  });


  it('should check read external storage', async () => {
    PermissionsAndroid.check.mockResolvedValue({});
    await service.checkReadExternalStorage();
    expect(PermissionsAndroid.check).toBeCalled();
  });


  it('should check read external storage', async () => {
    PermissionsAndroid.check.mockRejectedValue({});
    await service.checkReadExternalStorage();
    expect(PermissionsAndroid.check).toBeCalled();
  });

  it('should check camera and resolve', async () => {
    PermissionsAndroid.check.mockResolvedValue({});
    await service.checkCamera();
    expect(PermissionsAndroid.check).toBeCalled();
  });


  it('should check camera and reject', async () => {
    PermissionsAndroid.check.mockRejectedValue({});
    await service.checkCamera();
    expect(PermissionsAndroid.check).toBeCalled();
  });

  it('should check read sms', async () => {
    PermissionsAndroid.check.mockResolvedValue({});
    await service.checkReadSms();
    expect(PermissionsAndroid.check).toBeCalled();
  });


  it('should check read sms', async () => {
    PermissionsAndroid.check.mockRejectedValue({});
    await service.checkReadSms();
    expect(PermissionsAndroid.check).toBeCalled();
  });

  it('should check external storage write permission', async () => {
    PermissionsAndroid.check.mockResolvedValue({});
    await service.checkWriteExternalStorage();
    expect(PermissionsAndroid.check).toBeCalled();
  });


  it('should check external storage write permission', async () => {
    PermissionsAndroid.check.mockRejectedValue({});
    await service.checkWriteExternalStorage();
    expect(PermissionsAndroid.check).toBeCalled();
  });

  it('should write external storage', async () => {
    PermissionsAndroid.check.mockResolvedValue({});
    await service.writeExternalStorage();
    expect(PermissionsAndroid.request).toBeCalled();
  });


  it('should write external storage', async () => {
    PermissionsAndroid.check.mockRejectedValue({});
    await service.writeExternalStorage();
    expect(PermissionsAndroid.request).toBeCalled();
  });

  it('should check external storage with camera', async () => {
    PermissionsAndroid.request.mockResolvedValue({});
    await service.camera();
    expect(PermissionsAndroid.request).toBeCalled();
  });


  it('should check external storage with camera', async () => {
    PermissionsAndroid.request.mockRejectedValue({});
    await service.camera();
    expect(PermissionsAndroid.request).toBeCalled();
  });

  it('should check read external storage', async () => {
    await service.readSms();
    expect(PermissionsAndroid.request).toBeCalled();
  });
});