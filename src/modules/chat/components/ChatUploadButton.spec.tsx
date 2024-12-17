import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ChatUploadButton from './ChatUploadButton';
import sp from '~/services/serviceProvider';
import { PickedMedia } from '../../../common/services/image-picker.service';

jest.mock('~/services/serviceProvider', () => ({
  resolve: jest.fn(),
  styles: {
    style: {
      colorSecondaryText: {},
    },
  },
}));

const mockOnUploadImage = jest.fn();
const mockOnUploadingStateChange = jest.fn();
const mockImagePickerService = {
  launchImageLibrary: jest.fn(),
};

describe('ChatUploadButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sp.resolve as jest.Mock).mockReturnValue(mockImagePickerService);
  });

  it('renders', () => {
    render(
      <ChatUploadButton
        onUploadImage={mockOnUploadImage}
        onUploadingStateChange={mockOnUploadingStateChange}
      />,
    );
  });

  it('handles successful image upload', async () => {
    const mockImage: PickedMedia = {
      uri: 'test-uri',
      width: 100,
      height: 100,
      mime: 'image/jpeg',
      fileName: 'test.jpg',
    };

    mockImagePickerService.launchImageLibrary.mockResolvedValue([mockImage]);

    const { getByTestId } = render(
      <ChatUploadButton
        onUploadImage={mockOnUploadImage}
        onUploadingStateChange={mockOnUploadingStateChange}
      />,
    );

    const button = getByTestId('UploadChatImageButton');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnUploadImage).toHaveBeenCalledWith(mockImage);
      expect(mockOnUploadingStateChange).toHaveBeenCalledWith(false);
    });
  });

  it('handles cancelled image upload', async () => {
    mockImagePickerService.launchImageLibrary.mockResolvedValue(null);

    const { getByTestId } = render(
      <ChatUploadButton
        onUploadImage={mockOnUploadImage}
        onUploadingStateChange={mockOnUploadingStateChange}
      />,
    );

    const button = getByTestId('UploadChatImageButton');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockImagePickerService.launchImageLibrary).toHaveBeenCalledWith({
        type: 'Images',
        crop: false,
        maxFiles: 1,
      });
      expect(mockOnUploadingStateChange).not.toHaveBeenCalled();
      expect(mockOnUploadImage).not.toHaveBeenCalled();
    });
  });

  it('handles upload error', async () => {
    mockImagePickerService.launchImageLibrary.mockRejectedValue(
      new Error('Upload failed'),
    );

    const { getByTestId } = render(
      <ChatUploadButton
        onUploadImage={mockOnUploadImage}
        onUploadingStateChange={mockOnUploadingStateChange}
      />,
    );

    const button = getByTestId('UploadChatImageButton');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnUploadingStateChange).toHaveBeenCalledWith(false);
    });
  });
});
