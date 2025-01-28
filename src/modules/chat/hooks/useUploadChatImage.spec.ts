import { renderHook } from '@testing-library/react-hooks';
import { useUploadChatImage } from './useUploadChatImage';
import sp from '~/services/serviceProvider';
import { PickedMedia } from '~/common/services/image-picker.service';

jest.mock('~/services/serviceProvider', () => ({
  resolve: jest.fn(),
}));

describe('useUploadChatImage', () => {
  const mockRoomGuid = 'test-room-guid';
  const mockMedia: PickedMedia = {
    uri: 'test-uri',
    mime: 'image/jpeg',
    fileName: 'test.jpg',
    width: 100,
    height: 100,
  };

  const mockUploadService = {
    upload: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sp.resolve as jest.Mock).mockReturnValue(mockUploadService);
  });

  it('should upload image successfully', async () => {
    mockUploadService.upload.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useUploadChatImage(mockRoomGuid));
    const success = await result.current.uploadImage(mockMedia);

    expect(sp.resolve).toHaveBeenCalledWith('chatImageUpload');
    expect(mockUploadService.upload).toHaveBeenCalledWith(
      {
        ...mockMedia,
        type: mockMedia.mime,
      },
      mockRoomGuid,
    );
    expect(success).toBe(true);
  });

  it('should return false when upload fails', async () => {
    mockUploadService.upload.mockResolvedValue({ status: 'error' });

    const { result } = renderHook(() => useUploadChatImage(mockRoomGuid));
    const success = await result.current.uploadImage(mockMedia);

    expect(sp.resolve).toHaveBeenCalledWith('chatImageUpload');
    expect(mockUploadService.upload).toHaveBeenCalledWith(
      {
        ...mockMedia,
        type: mockMedia.mime,
      },
      mockRoomGuid,
    );
    expect(success).toBe(false);
  });

  it('should throw error when upload fails with exception', async () => {
    const mockError = new Error('Upload failed');
    mockUploadService.upload.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUploadChatImage(mockRoomGuid));

    await expect(result.current.uploadImage(mockMedia)).rejects.toThrow(
      mockError,
    );
    expect(sp.resolve).toHaveBeenCalledWith('chatImageUpload');
    expect(mockUploadService.upload).toHaveBeenCalledWith(
      {
        ...mockMedia,
        type: mockMedia.mime,
      },
      mockRoomGuid,
    );
  });
});
