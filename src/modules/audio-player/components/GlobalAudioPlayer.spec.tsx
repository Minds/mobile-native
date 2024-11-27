import { fireEvent, render, waitFor } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import TrackPlayer, {
  Track,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import GlobalAudioPlayer from './GlobalAudioPlayer';
import { pushBottomSheet } from '~/common/components/bottom-sheet';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');
sp.mockService('api');
sp.mockService('settings');

jest.mock('../hooks/useGetDownloadedList', () => jest.fn(() => ({ list: [] })));
jest.mock('~/common/components/bottom-sheet');

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
    (usePlaybackState as jest.Mock).mockReturnValue({ state: 'ready' });
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

  it('should pause if track is playing', async () => {
    (usePlaybackState as jest.Mock).mockReturnValue({ state: 'playing' });

    const comp = render(<GlobalAudioPlayer />);
    const playBtn = comp.getByTestId('play-button');

    fireEvent.press(playBtn);

    await waitFor(() => {
      expect(TrackPlayer.pause).toHaveBeenCalled();
    });
  });

  it('should play track from start if ended', async () => {
    (usePlaybackState as jest.Mock).mockReturnValue({ state: 'ended' });

    const comp = render(<GlobalAudioPlayer />);
    const playBtn = comp.getByTestId('play-button');

    fireEvent.press(playBtn);

    await waitFor(() => {
      expect(TrackPlayer.play).toHaveBeenCalled();
      expect(TrackPlayer.seekTo).toHaveBeenCalledWith(0);
    });
  });

  it('should reverse track 10 seconds', async () => {
    const comp = render(<GlobalAudioPlayer />);
    const btn = comp.getByTestId('replay-button');

    fireEvent.press(btn);

    await waitFor(() => {
      expect(TrackPlayer.play).toHaveBeenCalled();
      expect(TrackPlayer.seekBy).toHaveBeenCalledWith(-10);
    });
  });

  it('should forward track 10 seconds', async () => {
    const comp = render(<GlobalAudioPlayer />);
    const btn = comp.getByTestId('forward-button');

    fireEvent.press(btn);

    await waitFor(() => {
      expect(TrackPlayer.play).toHaveBeenCalled();
      expect(TrackPlayer.seekBy).toHaveBeenCalledWith(10);
    });
  });

  it('should launch the fullscreen player when artwork tapped', () => {
    const comp = render(<GlobalAudioPlayer />);
    const btn = comp.getByTestId('audio-player-artwork');

    fireEvent.press(btn);

    expect(pushBottomSheet).toHaveBeenCalled();
  });

  it('should launch the fullscreen player when meta tapped', () => {
    const comp = render(<GlobalAudioPlayer />);
    const btn = comp.getByTestId('audio-player-meta');

    fireEvent.press(btn);

    expect(pushBottomSheet).toHaveBeenCalled();
  });

  it('sould not launch the fullscreen player when artwork tapped if already in fullscreen mode', () => {
    const comp = render(<GlobalAudioPlayer fullscreen />);
    const btn = comp.getByTestId('audio-player-artwork');

    fireEvent.press(btn);

    expect(pushBottomSheet).not.toHaveBeenCalled();
  });

  it('sould not launch the fullscreen player when meta tapped if already in fullscreen mode', () => {
    const comp = render(<GlobalAudioPlayer fullscreen />);
    const btn = comp.getByTestId('audio-player-meta');

    fireEvent.press(btn);

    expect(pushBottomSheet).not.toHaveBeenCalled();
  });
});
