import type { ApiService } from '~/common/services/api.service';
import { ApiResponse } from '~/common/services/ApiResponse';
import { Media } from '../../../common/stores/AttachmentStore';

/**
 * Chat image upload service.
 */
export class ChatImageUploadService {
  constructor(private api: ApiService) {}

  /**
   * Upload image to chat. Note that this function will NOT update the room.
   * @param { Media } media - The media to upload.
   * @param { string } roomGuid - The room GUID.
   * @returns { Promise<ApiResponse> } The API response.
   */
  public async upload(media: Media, roomGuid: string): Promise<ApiResponse> {
    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.filename || 'test',
    };
    if (file.type === 'image') {
      file.type = 'image/jpeg';
    }

    return this.api.upload(`api/v3/chat/image/upload/${roomGuid}`, { file });
  }
}
