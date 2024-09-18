import SystemSetting from 'react-native-system-setting';
import { VideoPlayerService } from '~/common/services/video-player.service';
import { Storages } from '~/common/services/storage/storages.service';

jest.mock('react-native-system-setting');
jest.mock('expo-keep-awake');
jest.mock('~/common/services/storage/storages.service');

const mockPlayerRef1 = {
  pause: jest.fn(),
};

const mockPlayerRef2 = {
  pause: jest.fn(),
};

/**
 * Tests
 */
describe('Video player service', () => {
  const videoPlayerService = new VideoPlayerService(new Storages());
  beforeEach(() => {
    mockPlayerRef1.pause.mockClear();
    mockPlayerRef2.pause.mockClear();
  });

  it('should set the current ref', () => {
    expect(videoPlayerService.current).toBe(null);

    videoPlayerService.setCurrent(mockPlayerRef1);

    expect(videoPlayerService.current).toBe(mockPlayerRef1);
  });

  it('should pause the previous video', () => {
    videoPlayerService.setCurrent(mockPlayerRef2);

    expect(videoPlayerService.current).toBe(mockPlayerRef2);

    expect(mockPlayerRef1.pause).toBeCalled();
  });

  it('should clear the ref', () => {
    videoPlayerService.clear();
    expect(videoPlayerService.current).toBe(null);
  });
});
