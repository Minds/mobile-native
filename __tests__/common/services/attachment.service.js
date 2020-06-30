import api from '../../../src/common/services/api.service';
import imagePicker from '../../../src/common/services/image-picker.service';
import service from '../../../src/common/services/attachment.service';
jest.mock('../../../src/common/services/api.service');
// jest.mock('../../../src/capture/CaptureService');
jest.mock('../../../src/common/services/image-picker.service');

/**
 * Tests
 */
describe('Attachment service', () => {
  beforeEach(() => {
    api.upload.mockClear();
    api.delete.mockClear();
  });

  it('should call attach media endpoint', async () => {
    let media = {
        uri: 'uri',
        path: 'path',
        type: 'type',
        filename: 'filename'
    }
    const apiResponse = {loaded: 10, total:200};

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
    }
    const apiResponse = {loaded: 10, total:200};

    api.upload.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.attachMedia(media);

    expect(api.upload.mock.calls.length).toEqual(1);
    media.name = 'test';
    expect(api.upload.mock.calls[0][1]).toEqual(media);
    expect(api.upload.mock.calls[0][0]).toEqual('api/v1/media/');

  });

  it('should call launchCamera', async () => {
    const apiResponse = {uri: 'aaaa', 'path': 'path metheny'};

    imagePicker.launchCamera.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.video();


    expect(res).toEqual({
        uri: 'aaaa',
        path: 'path metheny',
        type: 'video/mp4',
        fileName: 'image.mp4'
    });

  });

  it('should call launchCamera with null response and return', async () => {

    imagePicker.launchCamera.mockResolvedValue(null);

    // call tested method
    const res = await service.video();
    expect(res).toEqual(null);

  });


  it('should call launchCamera', async () => {
    const apiResponse = {uri: 'aaaa', 'path': 'path metheny'};

    imagePicker.launchCamera.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.photo();


    expect(res).toEqual({
        uri: 'aaaa',
        path: 'path metheny',
        type: 'image/jpeg',
        fileName: 'image.jpg'
    });

  });

  it('should call launchCamera with null response and return', async () => {

    imagePicker.launchCamera.mockResolvedValue(null);

    // call tested method
    const res = await service.photo();
    expect(res).toEqual(null);

  });


  it('should call delete media endpoint', async () => {
    const apiResponse = {success:true};

    api.delete.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.deleteMedia(1111);

    expect(api.delete.mock.calls.length).toEqual(1);
    expect(api.delete.mock.calls[0][0]).toEqual('api/v1/media/1111');

  });

  it('should call launchImageLibrary', async () => {
    const apiResponse = {uri: 'aaaa', 'path': 'path metheny', width: 100};

    imagePicker.launchImageLibrary.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.gallery();


    expect(res).toEqual({
        uri: 'aaaa',
        path: 'path metheny',
        width: 100
    });

  });

  it('should call launchImageLibrary', async () => {
    const apiResponse = {uri: 'aaaa', 'path': 'path metheny'};

    imagePicker.launchImageLibrary.mockResolvedValue(apiResponse);

    // call tested method
    const res = await service.gallery();


    expect(res).toEqual({
        uri: 'aaaa',
        path: 'path metheny',
        type: 'video/mp4'
    });

  });

  it('should call launchImageLibrary with null response and return', async () => {

    imagePicker.launchImageLibrary.mockResolvedValue(null);

    // call tested method
    const res = await service.gallery();
    expect(res).toEqual(null);

  });

});