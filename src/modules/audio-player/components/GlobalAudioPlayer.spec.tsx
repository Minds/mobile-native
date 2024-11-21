import { fireEvent, render, waitFor } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import TrackPlayer, {
  Track,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import GlobalAudioPlayer from './GlobalAudioPlayer';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');
sp.mockService('api');
sp.mockService('settings');

jest.mock('../hooks/useGetDownloadedList', () => jest.fn(() => ({ list: [] })));

const activeTrack: Track = {
  id: '123',
  title: 'Active Track',
  artist: 'Artist name',
  url: 'https://fake-track',
};

describe('GlobalAudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useActiveTrack as jest.Mock).mockReturnValue(activeTrack);
    (usePlaybackState as jest.Mock).mockResolvedValue({ state: 'ready' });
  });

  it('should render component', async () => {
    const comp = render(<GlobalAudioPlayer />);
    expect(comp).toBeTruthy();
  });

  it('should play track', async () => {
    const comp = render(<GlobalAudioPlayer />);
    const playBtn = comp.getByTestId('play-button');

    fireEvent.press(playBtn);

    await waitFor(() => {
      expect(TrackPlayer.play).toHaveBeenCalled();
    });
  });
});
