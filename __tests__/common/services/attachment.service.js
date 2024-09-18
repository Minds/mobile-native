import { ApiService } from '~/common/services/api.service';
import { LogService } from '~/common/services/log.service';
import { I18nService } from '~/common/services/i18n.service';
import { ImagePickerService } from '~/common/services/image-picker.service';
import { AttachmentService } from '~/common/services/attachment.service';
import { PermissionsService } from '~/common/services/permissions.service';

// jest.mock('~/capture/CaptureService');
jest.mock('~/common/services/permissions.service');
jest.mock('~/common/services/api.service');
jest.mock('~/common/services/image-picker.service');
jest.mock('~/common/services/upgrade-modal.service', () => ({}));

/**
 * Tests
 */
describe('Attachment service', () => {
  const api = new ApiService();
  const logService = new LogService();
  const permissions = new PermissionsService();
  const i18n = new I18nService();
  const imagePicker = new ImagePickerService();

  const service = new AttachmentService(
    api,
    logService,
    permissions,
    i18n,
    imagePicker,
  );

  beforeEach(() => {
    api.upload.mockClear();
    api.delete.mockClear();
    imagePicker.launchCamera.mockClear();
    imagePicker.launchImageLibrary.mockClear();
  });

  it('should call attach media endpoint', async () => {
    let media = {
      uri: 'uri',
      path: 'path',
      type: 'type',
      filename: 'filename',
    };
    const apiResponse = { loaded: 10, total: 200 };

    api.upload.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.attachMedia(media);

    // call api upload one time
    expect(api.upload.mock.calls.length).toEqual(1);
    expect(api.upload.mock.calls[0][0]).toEqual('api/v1/media/');
  });

  it('should call attach media endpoint withouth filename should fallback', async () => {
    let media = {
      uri: 'uri',
      path: 'path',
      type: 'type',
    };
    const apiResponse = { loaded: 10, total: 200 };

    api.upload.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.attachMedia(media);

    expect(api.upload.mock.calls.length).toEqual(1);

    expect(api.upload.mock.calls[0][1]).toEqual({
      file: { name: 'test', ...media },
    });
    expect(api.upload.mock.calls[0][0]).toEqual('api/v1/media/');
  });

  it('should call launchCamera for video', async () => {
    const apiResponse = { uri: 'fakeuri', path: 'fakeuri' };

    imagePicker.launchCamera.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.video();

    expect(res).toEqual({
      uri: 'fakeuri',
      path: 'fakeuri',
      type: 'video/mp4',
      fileName: 'image.mp4',
    });
  });

  it('should call launchCamera with null response and return', async () => {
    imagePicker.launchCamera.mockResolvedValue(null);

    // call tested method
    const res = await service.video();
    expect(res).toEqual(null);
  });

  it('should call launchCamera for image', async () => {
    const apiResponse = { uri: 'fakeuri', path: 'fakeuri' };

    imagePicker.launchCamera.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.photo();

    expect(res).toEqual({
      uri: 'fakeuri',
      path: 'fakeuri',
      type: 'image/jpeg',
      fileName: 'image.jpg',
    });
  });

  it('should call launchCamera with null response and return', async () => {
    imagePicker.launchCamera.mockResolvedValue(null);

    // call tested method
    const res = await service.photo();
    expect(res).toEqual(null);
  });

  it('should call delete media endpoint', async () => {
    const apiResponse = { success: true };

    api.delete.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.deleteMedia(1111);

    expect(api.delete.mock.calls.length).toEqual(1);
    expect(api.delete.mock.calls[0][0]).toEqual('api/v1/media/1111');
  });

  it('should call launchImageLibrary', async () => {
    const apiResponse = { uri: 'fakeuri', path: 'fakeuri', width: 100 };

    imagePicker.launchImageLibrary.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.gallery();

    expect(res).toEqual({
      uri: 'fakeuri',
      path: 'fakeuri',
      width: 100,
    });
  });

  it('should call launchImageLibrary with null response and return', async () => {
    imagePicker.launchImageLibrary.mockResolvedValue(null);

    // call tested method
    const res = await service.gallery();
    expect(res).toEqual(null);
  });
});
