import * as ImagePicker from 'expo-image-picker';
import { ImagePickerService } from '~/common/services/image-picker.service';

jest.mock('expo-image-picker');
jest.mock('../../../AppMessages', () => ({}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'android',
    select: obj => 'android',
  },
}));

/**
 * Tests
 */
describe('Image picker service', () => {
  const service = new ImagePickerService();
  it('should launch camera', async () => {
    ImagePicker.launchCameraAsync.mockResolvedValue({ assets: null });

    await service.launchCamera({ type: 'Images' });

    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
  });

  it('should launch gallery picker', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({ assets: null });

    await service.launchImageLibrary({ type: 'Images' });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  });
});
