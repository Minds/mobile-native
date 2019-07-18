import api from './api.service';
import imagePicker from './image-picker.service';

/**
 * Attacment service
 */
class AttachmentService {

  /**
   * Attach media file
   * @param {object} media
   * @param {function} onProgress
   */
  async attachMedia(media, extra, onProgress=null) {

    let type = 'image'

    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.fileName || 'test'
    };

    const progress = (e) => {
      let pct = e.loaded / e.total;
      if (onProgress) onProgress(pct);
    }

    if(file.type.includes('video')){
      return this.uploadToS3(file,progress);
    }

    return api.upload('api/v1/media/', file, extra, progress);
  }

  /**
   * Handles upload to s3 in three steps:
   *  1) prepare request return lease with signed url
   *  2) upload file to S3 with signed url
   *  3) complete upload
   * @param {any} file 
   * @param {function} progress 
   */
  async uploadToS3(file, progress){
    // Prepare media and wait for lease => {media_type, guid}
    const {lease} = await api.put(`api/v2/media/upload/prepare/video`);

    // upload file to s3 
    await api.uploadToS3(lease, file, progress);

    // complete upload and wait for status
    const {status} = await api.put(`api/v2/media/upload/complete/${lease.media_type}/${lease.guid}`); 

    // if false is returned, upload fails message will be showed
    return status === 'success' ? {guid: lease.guid} : false;
  }

  /**
   * Delete uploaded media
   * @param {string} guid
   */
  deleteMedia(guid) {
    return api.delete('api/v1/media/' + guid);
  }

  /**
   * Capture video
   */
  async video() {
    const response = await imagePicker.launchCamera('video');

    if (response) {
      return {
        uri: response.uri,
        path: response.path,
        type: 'video/mp4',
        fileName: 'image.mp4'
      }
    }

    return response;
  }

  /**
   * Capture photo
   */
  async photo() {
    const response = await imagePicker.launchCamera('photo');

    if (response) {
      return {
        uri: response.uri,
        path: response.path,
        type: 'image/jpeg',
        fileName: 'image.jpg'
      }
    }

    return response;
  }

  /**
   * Open gallery
   * @param {string} mediaType photo or video (or mixed only ios)
   */
  async gallery(mediaType = 'photo') {

    const response = await imagePicker.launchImageLibrary(mediaType);

    if (!response) return response;

    if (!response.type && !response.width) {
      response.type = 'video/mp4';
    }

    return response;
  }
}

export default new AttachmentService();
