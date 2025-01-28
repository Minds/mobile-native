import { ApiResponse } from '../../../common/services/ApiResponse';
import { PickedMedia } from '../../../common/services/image-picker.service';
import { ChatImageUploadService } from './chat-image-upload-service';
import { ApiService } from '~/common/services/api.service';

describe('ChatImageUploadService', () => {
  let service: ChatImageUploadService;
  let mockApiService: jest.Mocked<ApiService>;

  beforeEach(() => {
    mockApiService = {
      upload: jest.fn(),
    } as any;

    service = new ChatImageUploadService(mockApiService);
  });

  describe('upload', () => {
    const mockRoomGuid: string = '123';
    const mockSuccessResponse: ApiResponse = { status: 'success' };
    const mockMedia: PickedMedia = {
      uri: 'file://test.jpg',
      fileName: 'test.jpg',
      mime: 'image/jpeg',
      width: 100,
      height: 100,
    };

    it('should call api.post with correct parameters', async () => {
      const expectedFormData = new FormData();
      expectedFormData.append('file', {
        ...mockMedia,
        type: mockMedia.mime,
        name: mockMedia.fileName,
      });

      await service.upload(
        {
          ...mockMedia,
          type: mockMedia.mime,
        },
        mockRoomGuid,
      );

      expect(mockApiService.upload).toHaveBeenCalledWith(
        `api/v3/chat/image/upload/${mockRoomGuid}`,
        expect.anything(),
      );
    });

    it('should return api response', async () => {
      mockApiService.upload.mockResolvedValueOnce(
        Promise.resolve(mockSuccessResponse),
      );

      const result = await service.upload(
        {
          ...mockMedia,
          type: mockMedia.mime,
        },
        mockRoomGuid,
      );

      expect(result).toBe(mockSuccessResponse);
    });

    it('should propagate api errors', async () => {
      const mockError = new Error('API Error');
      mockApiService.upload.mockRejectedValueOnce(mockError);

      await expect(
        service.upload(
          {
            ...mockMedia,
            type: mockMedia.mime,
          },
          mockRoomGuid,
        ),
      ).rejects.toThrow(mockError);
    });
  });
});
