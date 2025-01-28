import { useCallback } from 'react';
import { PickedMedia } from '~/common/services/image-picker.service';
import sp from '~/services/serviceProvider';
import { ApiResponse } from '~/common/services/ApiResponse';

/** Hook return type */
type UseUploadChatImageReturnType = {
  uploadImage: (media: PickedMedia) => Promise<boolean>;
};

/**
 * Hook for uploading a chat image.
 * @param { string } roomGuid - The GUID of the room to upload the image to.
 * @returns { UseUploadChatImageReturnType } An object containing the uploadImage function.
 */
export const useUploadChatImage = (
  roomGuid: string,
): UseUploadChatImageReturnType => {
  const uploadImage = useCallback(
    async (media: PickedMedia): Promise<boolean> => {
      try {
        const response: ApiResponse = await sp
          .resolve('chatImageUpload')
          .upload(
            {
              ...media,
              type: media.mime,
            },
            roomGuid,
          );
        return response?.status === 'success';
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },
    [roomGuid],
  );

  return { uploadImage };
};
