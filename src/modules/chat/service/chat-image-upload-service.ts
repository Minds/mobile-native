import type { ApiService } from '~/common/services/api.service';
import { PickedMedia } from '~/common/services/image-picker.service';
import { ApiResponse } from '~/common/services/ApiResponse';

/**
 * Chat image upload service.
 */
export class ChatImageUploadService {
  constructor(private api: ApiService) {}

  /**
   * Upload image to chat. Note that this function will NOT update the room.
   * @param { PickedMedia } media - The media to upload.
   * @param { string } roomGuid - The room GUID.
   * @returns { Promise<ApiResponse> } The API response.
   */
  public async upload(
    media: PickedMedia,
    roomGuid: string,
  ): Promise<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', {
      ...media,
      type: media.mime,
      name: media.fileName,
    });

    return this.api.post(`api/v3/chat/image/upload/${roomGuid}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
